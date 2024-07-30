import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class IndexSeeder extends BaseSeeder {
  private async runSeeder(Seeder: { default: typeof BaseSeeder }) {
    await new Seeder.default(this.client).run()
  }

  async run() {
    await this.runSeeder(await import('#database/seeders/role_seeder'))
    await this.runSeeder(await import('#database/seeders/admin_seeder'))
    await this.runSeeder(await import('#database/seeders/user_seeder'))
    await this.runSeeder(await import('#database/seeders/location_seeder'))
    await this.runSeeder(await import('#database/seeders/item_seeder'))
    await this.runSeeder(await import('#database/seeders/item_status_seeder'))
    await this.runSeeder(await import('#database/seeders/set_seeder'))
    await this.runSeeder(await import('#database/seeders/item_set_seeder'))
    await this.runSeeder(await import('#database/seeders/item_validation_seeder'))
    await this.runSeeder(await import('#database/seeders/set_validation_seeder'))
    await this.runSeeder(await import('#database/seeders/schedule_seeder'))
    await this.runSeeder(await import('#database/seeders/schedule_assignment_seeder'))
    await this.runSeeder(await import('#database/seeders/workday_seeder'))
  }
}
