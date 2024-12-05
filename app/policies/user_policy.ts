import { BasePolicy } from '@adonisjs/bouncer'
import User from '#models/user'
import Roles from '#enums/roles'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class UserPolicy extends BasePolicy {
  before(user: User | null): AuthorizerResponse | undefined {
    if (!user) return false
    return user.roleId === Roles.ADMIN
  }

  viewAny(_user: User): AuthorizerResponse {
    return false
  }
  view(_user: User): AuthorizerResponse {
    return false
  }
  create(_user: User): AuthorizerResponse {
    return false
  }
  update(_user: User): AuthorizerResponse {
    return false
  }
  delete(_user: User): AuthorizerResponse {
    return false
  }
}
