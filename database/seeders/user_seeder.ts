import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { UserFactory } from '#factories/user_factory'
import Roles from '#enums/roles'

export default class extends BaseSeeder {
  async run() {
    const roleConfigs = [
      { roleId: Roles.PHOTOGRAPHE, count: 3 },
      { roleId: Roles.ASSISTANT_PHOTOGRAPHE, count: 6 },
      { roleId: Roles.DECORATEUR, count: 3 },
      { roleId: Roles.ASSISTANT_DECORATEUR, count: 6 },
      { roleId: Roles.CHAUFFEUR_ASSISTANT, count: 3 },
    ]

    for (const config of roleConfigs) {
      await UserFactory.merge({ roleId: config.roleId }).createMany(config.count)
    }
  }
}
