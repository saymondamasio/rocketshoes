import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { userHasAuthorization } from '../utils/userHasAuthorization'

type UseCanParams = {
  permissions?: string[]
  roles?: string[]
}

export function useCan({ permissions = [], roles = [] }: UseCanParams) {
  const { user, isAuthenticated } = useContext(AuthContext)

  if (!isAuthenticated || !user) {
    return false
  }

  const hasAuthorization = userHasAuthorization({
    user,
    permissions,
    roles,
  })

  return hasAuthorization
}
