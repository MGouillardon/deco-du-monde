import Role from '#models/role'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Role.createMany([
      { name: 'admin' },
      { name: 'photographe' },
      { name: 'assistant-photographe' },
      { name: 'décorateur' },
      { name: 'assistant-decorateur' },
      { name: 'chauffeur_assistant' },
    ])
  }
}
