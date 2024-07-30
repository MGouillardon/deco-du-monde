import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Set from '#models/set'
import User from '#models/user'
import SetValidation from '#models/set_validation'
import { SetValidationType } from '#enums/set_validation_type'
import { DateTime } from 'luxon'

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
      const isPhotographyValidated = Math.random() < 0.5
      await SetValidation.create({
        setId: set.id,
        userId: isPhotographyValidated ? randomPhotographer.id : null,
        type: SetValidationType.PHOTOGRAPHY,
        validatedAt: isPhotographyValidated ? DateTime.local() : null,
        isValidated: isPhotographyValidated,
      })

      const randomDecorator = decorators[Math.floor(Math.random() * decorators.length)]
      const isInstallationValidated = Math.random() < 0.5
      await SetValidation.create({
        setId: set.id,
        userId: isInstallationValidated ? randomDecorator.id : null,
        type: SetValidationType.INSTALLATION,
        validatedAt: isInstallationValidated ? DateTime.local() : null,
        isValidated: isInstallationValidated,
      })

      const isUninstallationValidated = Math.random() < 0.5
      await SetValidation.create({
        setId: set.id,
        userId: isUninstallationValidated ? randomDecorator.id : null,
        type: SetValidationType.UNINSTALLATION,
        validatedAt: isUninstallationValidated ? DateTime.local() : null,
        isValidated: isUninstallationValidated,
      })
    }
  }
}
