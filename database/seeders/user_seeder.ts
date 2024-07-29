import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { UserFactory } from '#factories/user_factory'
import Roles from '#enums/roles'

export default class extends BaseSeeder {
  async run() {
    const roleConfigs = [
      { roleId: Roles.PHOTOGRAPH, count: 3 },
      { roleId: Roles.ASSISTANT_PHOTOGRAPH, count: 6 },
      { roleId: Roles.DECORATOR, count: 3 },
      { roleId: Roles.ASSISTANT_DECORATOR, count: 6 },
      { roleId: Roles.DRIVER_ASSISTANT, count: 3 },
    ]

    for (const config of roleConfigs) {
      await UserFactory.merge({ roleId: config.roleId }).createMany(config.count)
    }
  }
}
