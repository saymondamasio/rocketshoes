import decode from 'jwt-decode'
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next'
import { destroyCookie, parseCookies } from 'nookies'
import { AuthTokenError } from '../errors/AuthTokenError'
import { userHasAuthorization } from './userHasAuthorization'

type WithSSRAuthOptions = {
  permissions?: string[]
  roles?: string[]
}

export function withSSRAuth<T>(
  fn: GetServerSideProps<T>,
  options?: WithSSRAuthOptions
) {
  return async (
    ctx: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<T>> => {
    const cookies = parseCookies(ctx)

    const token = cookies['nextauth.token']

    if (!token) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      }
    }

    if (options) {
      const user = decode<{ permissions: string[]; roles: string[] }>(token)

      const { permissions, roles } = options

      const hasAuthorization = userHasAuthorization({
        user,
        permissions,
        roles,
      })

      if (!hasAuthorization) {
        // enviar para uma pagina que todos os usuários podem acessar ou uma pagina 404
        return {
          redirect: {
            destination: '/dashboard',
            permanent: false,
          },
        }
      }
    }

    try {
      return await fn(ctx)
    } catch (error) {
      if (error instanceof AuthTokenError) {
        destroyCookie(ctx, 'nextauth.token')
        destroyCookie(ctx, 'nextauth.refreshToken')

        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        }
      }

      return {
        props: {} as T,
      }
    }
  }
}
