import { BasePolicy } from '@adonisjs/bouncer'
import User from '#models/user'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'
import Roles from '#enums/roles'

export default class DashboardPolicy extends BasePolicy {
  viewDashboard(user: User): AuthorizerResponse {
    return [Roles.ADMIN, Roles.PHOTOGRAPH, Roles.DECORATOR].includes(user.roleId)
  }
}
