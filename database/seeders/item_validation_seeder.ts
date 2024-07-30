import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Item from '#models/item'
import User from '#models/user'
import ItemValidation from '#models/item_validation'
import { DateTime } from 'luxon'

export default class ItemValidationSeeder extends BaseSeeder {
  async run() {
    const items = await Item.query().where('isPhotographedStudio', true)
    const photographers = await User.query().whereHas('role', (query) => {
      query.where('name', 'photograph').orWhere('name', 'assistant_photograph')
    })

    for (const item of items) {
      const randomPhotographer = photographers[Math.floor(Math.random() * photographers.length)]
      const isValidated = Math.random() < 0.9
      await ItemValidation.create({
        itemId: item.id,
        userId: randomPhotographer.id,
        isValidated: isValidated,
        validatedAt: isValidated ? DateTime.now() : null,
      })
    }
  }
}
