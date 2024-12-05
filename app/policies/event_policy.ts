import { BasePolicy } from '@adonisjs/bouncer'
import User from '#models/user'
import Roles from '#enums/roles'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'
import { EventType } from '#enums/event_type'
import Event from '#models/event'

export default class EventPolicy extends BasePolicy {
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
    return [Roles.PHOTOGRAPH, Roles.DECORATOR].includes(user.roleId)
  }

  update(user: User, event: Event): AuthorizerResponse {
    switch (event.type) {
      case EventType.STUDIO_SHOOT:
        return user.roleId === Roles.PHOTOGRAPH
      case EventType.SET_PREPARATION:
      case EventType.SET_SHOOT:
      case EventType.SET_REMOVAL:
        return user.roleId === Roles.DECORATOR
      default:
        return false
    }
  }

  delete(_user: User): AuthorizerResponse {
    return false
  }

  complete(user: User, event: Event): AuthorizerResponse {
    switch (event.type) {
      case EventType.STUDIO_SHOOT:
        return [Roles.PHOTOGRAPH, Roles.ASSISTANT_PHOTOGRAPH].includes(user.roleId)
      case EventType.SET_PREPARATION:
      case EventType.SET_REMOVAL:
        return [Roles.DECORATOR, Roles.ASSISTANT_DECORATOR].includes(user.roleId)
      case EventType.SET_SHOOT:
        return [Roles.PHOTOGRAPH, Roles.ASSISTANT_PHOTOGRAPH].includes(user.roleId)
      default:
        return false
    }
  }
}
