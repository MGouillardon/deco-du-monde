import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role from '#models/role'
import Roles from '#enums/roles'

export default class extends BaseSeeder {
  async run() {
    await Role.createMany([
      { id: Roles.ADMIN, name: 'admin' },
      { id: Roles.PHOTOGRAPHE, name: 'photographe' },
      { id: Roles.ASSISTANT_PHOTOGRAPHE, name: 'assistant-photographe' },
      { id: Roles.DECORATEUR, name: 'décorateur' },
      { id: Roles.ASSISTANT_DECORATEUR, name: 'assistant-decorateur' },
      { id: Roles.CHAUFFEUR_ASSISTANT, name: 'chauffeur_assistant' },
    ])
  }
}
