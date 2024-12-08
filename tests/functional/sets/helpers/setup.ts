import { SetFactory } from '#factories/set_factory'
import { SetValidationType } from '#enums/set_validation_type'
import { DateTime } from 'luxon'

export async function createBasicSet() {
  const set = await SetFactory.create()

  await Promise.all([
    set.related('validations').createMany([
      {
        type: SetValidationType.INSTALLATION,
        isValidated: false,
      },
      {
        type: SetValidationType.UNINSTALLATION,
        isValidated: false,
      },
      {
        type: SetValidationType.PHOTOGRAPHY,
        isValidated: false,
      },
    ]),
  ])

  return set
}

export async function createValidatedSet(type: SetValidationType) {
  const set = await SetFactory.create()

  await Promise.all([
    set.related('validations').createMany([
      {
        type: SetValidationType.INSTALLATION,
        isValidated: type === SetValidationType.INSTALLATION,
        validatedAt: type === SetValidationType.INSTALLATION ? DateTime.now() : null,
      },
      {
        type: SetValidationType.UNINSTALLATION,
        isValidated: type === SetValidationType.UNINSTALLATION,
        validatedAt: type === SetValidationType.UNINSTALLATION ? DateTime.now() : null,
      },
      {
        type: SetValidationType.PHOTOGRAPHY,
        isValidated: type === SetValidationType.PHOTOGRAPHY,
        validatedAt: type === SetValidationType.PHOTOGRAPHY ? DateTime.now() : null,
      },
    ]),
  ])

  return set
}

export const testSetData = {
  name: 'Test Set',
  description: 'Test Description',
  itemIds: [],
}
