import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Roles from '#enums/roles'

export default class AdminSeeder extends BaseSeeder {
  async run() {
    await User.updateOrCreate(
      { email: 'admin@example.com' },
      {
        fullName: 'Admin User',
        email: 'admin@example.com',
        password: 'password',
        roleId: Roles.ADMIN,
      }
    )
  }
}
