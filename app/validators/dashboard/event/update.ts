import vine from '@vinejs/vine'

export const updateEventValidator = vine.compile(
  vine.object({
    locationId: vine.number(),
    startTime: vine.date({
      formats: ['YYYY-MM-DDTHH:mm'],
    }),
    endTime: vine.date({
      formats: ['YYYY-MM-DDTHH:mm'],
    }),
    type: vine.string(),
    setId: vine.number().optional(),
    itemId: vine.number().optional(),
    assignments: vine.array(
      vine.object({
        userId: vine.number(),
        role: vine.string(),
      })
    ),
  })
)
