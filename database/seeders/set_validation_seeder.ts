import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Set from '#models/set'
import User from '#models/user'
import SetValidation from '#models/set_validation'
import { SetValidationType } from '#enums/set_validation_type'

export default class SetValidationSeeder extends BaseSeeder {
  async run() {
    const sets = await Set.all()
    const photographers = await User.query().whereHas('role', (query) => {
      query.where('name', 'photograph').orWhere('name', 'assistant_photograph')
    })
    const decorators = await User.query().whereHas('role', (query) => {
      query.where('name', 'decorator').orWhere('name', 'assistant_decorator')
    })

    for (const set of sets) {
      const randomPhotographer = photographers[Math.floor(Math.random() * photographers.length)]
      await SetValidation.create({
        setId: set.id,
        userId: randomPhotographer.id,
        type: SetValidationType.PHOTOGRAPHY,
        isValidated: Math.random() < 0.9,
      })

      const randomDecorator = decorators[Math.floor(Math.random() * decorators.length)]
      await SetValidation.create({
        setId: set.id,
        userId: randomDecorator.id,
        type: SetValidationType.INSTALLATION,
        isValidated: Math.random() < 0.95,
      })
      await SetValidation.create({
        setId: set.id,
        userId: randomDecorator.id,
        type: SetValidationType.UNINSTALLATION,
        isValidated: Math.random() < 0.95,
      })
    }
  }
}
