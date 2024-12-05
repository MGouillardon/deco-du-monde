import { BasePolicy } from '@adonisjs/bouncer'
import User from '#models/user'
import Roles from '#enums/roles'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class UserPolicy extends BasePolicy {
  before(user: User | null): AuthorizerResponse | undefined {
    if (!user) return false
    return user.roleId === Roles.ADMIN
  }
}
