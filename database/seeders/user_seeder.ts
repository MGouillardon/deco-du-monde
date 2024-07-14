import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role from '#models/role'
import { UserFactory } from '#factories/user_factory'

export default class extends BaseSeeder {
  async run() {
    const createUsersForRole = async (roleName: string, count: number) => {
      const role = await Role.findBy('name', roleName)
      if (!role) {
        console.error(`Role '${roleName}' not found`)
        return
      }

      await UserFactory.merge({ roleId: role.id }).createMany(count)
    }

    await createUsersForRole('photographe', 3)
    await createUsersForRole('assistant-photographe', 6)
    await createUsersForRole('décorateur', 3)
    await createUsersForRole('assistant-decorateur', 6)
    await createUsersForRole('chauffeur_assistant', 3)
  }
}
