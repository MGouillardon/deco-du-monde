import vine from '@vinejs/vine'

export const storeItemValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(4).maxLength(30),
    description: vine.string().trim().minLength(4).maxLength(1000),
  })
)
