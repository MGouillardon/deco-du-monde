import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Item from '#models/item'
import User from '#models/user'
import ItemValidation from '#models/item_validation'
import { DateTime } from 'luxon'
import { EventType } from '#enums/event_type'

export default class ItemValidationSeeder extends BaseSeeder {
  async run() {
    const photographers = await User.query().whereHas('role', (query) => {
      query.where('name', 'photograph').orWhere('name', 'assistant_photograph')
    })

    const studioItems = await Item.query().where('isPhotographedStudio', true)

    const photographedSetItems = await Item.query().whereHas('sets', (setQuery) => {
      setQuery.whereHas('events', (eventQuery) => {
        eventQuery
          .where('type', EventType.SET_SHOOT)
          .where('start_time', '<=', DateTime.now().toSQL())
      })
    })

    const allPhotographedItems = [...studioItems, ...photographedSetItems]

    for (const item of allPhotographedItems) {
      const randomPhotographer = photographers[Math.floor(Math.random() * photographers.length)]
      const isValidated = Math.random() < 0.75
      if (isValidated) {
        await ItemValidation.create({
          itemId: item.id,
          userId: randomPhotographer.id,
          isValidated: true,
          validatedAt: DateTime.now(),
        })
      }
    }
  }
}
