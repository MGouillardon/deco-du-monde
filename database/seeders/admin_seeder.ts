import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Role from '#models/role'

export default class AdminSeeder extends BaseSeeder {
  async run() {
    const adminRole = await Role.findBy('name', 'admin')

    if (adminRole) {
      await User.create({
        fullName: 'Admin User',
        email: 'admin@example.com',
        password: 'password',
        roleId: adminRole.id,
      })
    }
  }
}
