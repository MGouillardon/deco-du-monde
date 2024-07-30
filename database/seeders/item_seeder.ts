import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { ItemFactory } from '#factories/item_factory'

export default class ItemSeeder extends BaseSeeder {
  async run() {
    await ItemFactory.createMany(50)
  }
}
