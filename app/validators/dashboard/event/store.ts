import { EventType } from '#enums/event_type'
import vine from '@vinejs/vine'

export const storeEventValidator = vine.compile(
  vine.object({
    locationId: vine.number().positive(),
    startTime: vine.date({
      formats: ['YYYY-MM-DDTHH:mm'],
    }),
    endTime: vine.date({
      formats: ['YYYY-MM-DDTHH:mm'],
    }),
    type: vine.enum(Object.values(EventType)),
    setId: vine.number().positive().optional(),
    itemId: vine.number().positive().optional(),
    userIds: vine.array(vine.number().positive()).minLength(1),
  })
)
