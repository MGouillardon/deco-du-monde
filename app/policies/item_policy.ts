import { BasePolicy } from '@adonisjs/bouncer'
import User from '#models/user'
import Roles from '#enums/roles'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class ItemPolicy extends BasePolicy {
  before(user: User | null): AuthorizerResponse | undefined {
    if (user?.roleId === Roles.ADMIN) {
      return true
    }
    return undefined
  }

  viewAny(_user: User): AuthorizerResponse {
    return true
  }

  view(_user: User): AuthorizerResponse {
    return true
  }

  create(user: User): AuthorizerResponse {
    return user.roleId === Roles.PHOTOGRAPH
  }

  update(user: User): AuthorizerResponse {
    return user.roleId === Roles.PHOTOGRAPH
  }

  delete(_user: User): AuthorizerResponse {
    return false
  }

  validateStudioPhoto(user: User): AuthorizerResponse {
    return [Roles.PHOTOGRAPH, Roles.ASSISTANT_PHOTOGRAPH].includes(user.roleId)
  }
}
