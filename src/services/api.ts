import axios, { AxiosError } from 'axios'
import { GetServerSidePropsContext } from 'next'
import { parseCookies, setCookie } from 'nookies'
import { signOut } from '../contexts/AuthContext'
import { AuthTokenError } from '../errors/AuthTokenError'

type FailedRequest = {
  onSuccess: (token: string) => void
  onFailure: (error: AxiosError) => void
}

let isRefreshing = false
let failedRequestsQueue: FailedRequest[] = []

type Context = undefined | GetServerSidePropsContext

export function setupApiClient(ctx: Context = undefined) {
  let cookies = parseCookies(ctx)

  const api = axios.create({
    baseURL: 'http://localhost:3333',
    headers: {
      Authorization: `Bearer ${cookies['@rocketshoes:token']}`,
    },
  })

  api.interceptors.response.use(
    response => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        if (error.response.data.code === 'token.expired') {
          //renovar token
          cookies = parseCookies(ctx)

          const { 'nextauth.refreshToken': refreshToken } = cookies

          const originalConfig = error.config

          if (!isRefreshing) {
            isRefreshing = true

            api
              .post('/refresh', { refreshToken })
              .then(response => {
                const { token } = response.data

                setCookie(ctx, '@rocketshoes:token', token, {
                  maxAge: 60 * 60 * 24 * 30, // 30 days
                  path: '/',
                })

                //@ts-ignore
                api.defaults.headers['Authorization'] = `Bearer ${token}`

                failedRequestsQueue.forEach(request => request.onSuccess(token))
                failedRequestsQueue = []
              })
              .catch(error => {
                failedRequestsQueue.forEach(request => request.onFailure(error))
                failedRequestsQueue = []

                if (process.browser) {
                  signOut()
                }
              })
              .finally(() => {
                isRefreshing = false
              })
          }

          return new Promise((resolve, reject) => {
            failedRequestsQueue.push({
              onSuccess: (token: string) => {
                //@ts-ignore
                originalConfig.headers['Authorization'] = `Bearer ${token}`

                resolve(api(originalConfig))
              },
              onFailure: (error: AxiosError) => {
                reject(error)
              },
            })
          })
        } else {
          // deslogar usuário
          if (process.browser) {
            signOut()

            return Promise.reject(false)
          } else {
            return Promise.reject(new AuthTokenError())
          }
        }
      }

      return Promise.reject(error)
    }
  )

  return api
}
