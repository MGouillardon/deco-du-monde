import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { SetFactory } from '#factories/set_factory'

export default class SetSeeder extends BaseSeeder {
  async run() {
    await SetFactory.createMany(10)
  }
}
