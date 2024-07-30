import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Set from '#models/set'
import Item from '#models/item'

export default class ItemSetSeeder extends BaseSeeder {
  async run() {
    const items = await Item.all()
    const sets = await Set.all()

    for (const set of sets) {
      const randomItems = items.sort(() => 0.5 - Math.random()).slice(0, 5)
      await set.related('items').attach(randomItems.map((item) => item.id))
    }
  }
}
