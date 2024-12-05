import { BasePolicy } from '@adonisjs/bouncer'
import User from '#models/user'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class DashboardPolicy extends BasePolicy {
  viewDashboard(_user: User): AuthorizerResponse {
    return true
  }
}
