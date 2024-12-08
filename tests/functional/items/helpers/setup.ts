import { ItemFactory } from '#factories/item_factory'
import { ItemStatusType } from '#enums/item_status'
import { LocationType } from '#enums/location_type'
import { DateTime } from 'luxon'

export async function createBasicItem(status = ItemStatusType.NORMAL) {
  const item = await ItemFactory.create()

  await Promise.all([
    item.related('itemStatus').create({
      status,
      notes: null,
    }),
    item.related('validations').create({
      type: LocationType.STUDIO,
      isValidated: false,
    }),
  ])

  return item
}

export async function createStudioValidatedItem() {
  const item = await ItemFactory.merge({
    isPhotographedStudio: true,
  }).create()

  await Promise.all([
    item.related('itemStatus').create({
      status: ItemStatusType.STUDIO_VALIDATED,
      notes: null,
    }),
    item.related('validations').create({
      type: LocationType.STUDIO,
      isValidated: true,
      validatedAt: DateTime.now(),
    }),
  ])

  return item
}

export const testItemData = {
  name: 'Test Item',
  description: 'Test Description',
  isPhotographedStudio: false,
}
