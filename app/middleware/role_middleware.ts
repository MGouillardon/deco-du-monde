import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import Roles from '#enums/roles'

type AllowedRole = keyof typeof Roles | 'ALL'

export default class RoleMiddleware {
  async handle(
    { auth, response, session, request }: HttpContext,
    next: NextFn,
    allowedRoles: AllowedRole[]
  ) {
    const user = auth.user
    if (!user) {
      session.flash('errors', 'You must be logged in to access this page')
      return response.redirect().toRoute('login')
    }

    if (allowedRoles.includes('ALL')) {
      return next()
    }

    if (user.roleId === Roles.DRIVER_ASSISTANT && !request.url().includes('/events')) {
      return response.redirect().toRoute('index.event')
    }

    const allowedRoleIds = allowedRoles
      .filter((role): role is Exclude<AllowedRole, 'ALL'> => role !== 'ALL')
      .map((role) => Roles[role as keyof typeof Roles])

    if (allowedRoleIds.includes(user.roleId)) {
      return next()
    }

    session.flash('errors', 'You are not authorized to access this page')
    return response.redirect().toRoute('index.event')
  }
}
