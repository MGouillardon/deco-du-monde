import { EventType } from '#enums/event_type'
import vine from '@vinejs/vine'

export const storeEventValidator = vine.compile(
  vine.object({
    locationId: vine.number().positive(),
    startTime: vine.date(),
    endTime: vine.date(),
    type: vine.enum(Object.values(EventType)),
    setId: vine.number().positive().optional(),
    userIds: vine.array(vine.number().positive()).optional(),
  })
)
