import { ScheduleType } from '#enums/schedule_type'
import vine from '@vinejs/vine'

export const storeScheduleValidator = vine.compile(
  vine.object({
    locationId: vine.number().positive(),
    startTime: vine.date(),
    endTime: vine.date(),
    type: vine.enum(Object.values(ScheduleType)),
    setId: vine.number().positive().optional(),
    userIds: vine.array(vine.number().positive()).optional(),
  })
)
