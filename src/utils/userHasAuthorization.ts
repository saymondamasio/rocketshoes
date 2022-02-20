type User = {
  permissions: string[]
  roles: string[]
}

type UserAuthorizationParams = {
  user: User
  permissions?: string[]
  roles?: string[]
}

export function userHasAuthorization({
  user,
  permissions = [],
  roles = [],
}: UserAuthorizationParams) {
  if (permissions.length > 0) {
    // verifica se o usuário tem todas as permissões
    const hasAllPermissions = permissions.every(permission =>
      user?.permissions.includes(permission)
    )

    if (!hasAllPermissions) {
      return false
    }
  }

  if (roles.length > 0) {
    // verifica se o usuário tem pelo menos uma das roles
    const hasSomeRole = roles.some(role => user?.roles.includes(role))

    if (!hasSomeRole) {
      return false
    }
  }

  return true
}
