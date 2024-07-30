import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { SetFactory } from '#factories/set_factory'
import { DateTime } from 'luxon'

export default class SetSeeder extends BaseSeeder {
  async run() {
    await SetFactory.with('items', Math.floor(Math.random() * 8) + 3, (item) => {
      item.pivotAttributes(() => ({
        created_at: DateTime.local().toSQL({ includeOffset: false }),
      }))
    }).createMany(10)
  }
}
