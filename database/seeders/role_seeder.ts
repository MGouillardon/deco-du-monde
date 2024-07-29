import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role from '#models/role'
import Roles from '#enums/roles'

export default class extends BaseSeeder {
  async run() {
    await Role.createMany([
      { id: Roles.ADMIN, name: 'admin' },
      { id: Roles.PHOTOGRAPH, name: 'photograph' },
      { id: Roles.ASSISTANT_PHOTOGRAPH, name: 'assistant_photograph' },
      { id: Roles.DECORATOR, name: 'decorator' },
      { id: Roles.ASSISTANT_DECORATOR, name: 'assistant_decorator' },
      { id: Roles.DRIVER_ASSISTANT, name: 'driver_assistant' },
    ])
  }
}
