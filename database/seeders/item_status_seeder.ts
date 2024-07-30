import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Item from '#models/item'
import ItemStatus from '#models/item_status'
import { ItemStatusType } from '#enums/item_status'

export default class ItemStatusSeeder extends BaseSeeder {
  async run() {
    const items = await Item.all()
    for (const item of items) {
      const status =
        Math.random() < 0.1
          ? ItemStatusType.DAMAGED
          : Math.random() < 0.05
            ? ItemStatusType.LOST
            : ItemStatusType.NORMAL

      await ItemStatus.create({
        itemId: item.id,
        status: status,
        notes: status !== ItemStatusType.NORMAL ? 'Needs attention' : null,
      })
    }
  }
}
