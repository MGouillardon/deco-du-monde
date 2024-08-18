import vine from '@vinejs/vine'
import { ItemStatusType } from '#enums/item_status'

export const updateItemValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(255),
    description: vine.string().trim().optional(),
    isPhotographedStudio: vine.boolean(),
    status: vine.enum(Object.values(ItemStatusType)),
    notes: vine.string().trim().optional(),
    setIds: vine.array(vine.number()).optional(),
  })
)
