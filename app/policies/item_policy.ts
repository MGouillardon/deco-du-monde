import { BasePolicy } from '@adonisjs/bouncer'
import User from '#models/user'
import Roles from '#enums/roles'

export default class ItemPolicy extends BasePolicy {
  private isAdminOrPhotograph(user: User) {
    return user.roleId === Roles.ADMIN || user.roleId === Roles.PHOTOGRAPH
  }

  async viewAny() {
    return true
  }

  async create(user: User) {
    return this.isAdminOrPhotograph(user)
  }

  async view() {
    return true
  }

  async update(user: User) {
    return this.isAdminOrPhotograph(user)
  }

  async delete(user: User) {
    return user.roleId === Roles.ADMIN
  }
}
