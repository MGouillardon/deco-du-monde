import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Item from '#models/item'
import User from '#models/user'
import ItemValidation from '#models/item_validation'
import { DateTime } from 'luxon'

export default class ItemValidationSeeder extends BaseSeeder {
  async run() {
    const items = await Item.query()
      .where('isPhotographedStudio', true)
      .orWhereHas('sets', () => {})

    const photographers = await User.query().whereHas('role', (query) => {
      query.where('name', 'photograph').orWhere('name', 'assistant_photograph')
    })

    for (const item of items) {
      const randomPhotographer = photographers[Math.floor(Math.random() * photographers.length)]
      const isValidated = Math.random() < 0.75

      const now = DateTime.now()

      await ItemValidation.updateOrCreate(
        { itemId: item.id },
        {
          userId: isValidated ? randomPhotographer.id : null,
          isValidated: isValidated,
          validatedAt: isValidated ? now : null,
        }
      )
    }
  }
}
