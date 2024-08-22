import vine from '@vinejs/vine'

export const updateSetValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(30),
    description: vine.string().trim().maxLength(255).optional(),
    itemIds: vine.array(vine.number().positive()).optional(),
    isPhotographed: vine.boolean().optional(),
  })
)