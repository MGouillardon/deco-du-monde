import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Location from '#models/location'
import ScheduleAssignment from '#models/schedule_assignment'
import Workday from '#models/workday'
import Set from '#models/set'
import { ScheduleType } from '#enums/schedule_type'

export default class Schedule extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare locationId: number

  @column.dateTime()
  declare startTime: DateTime

  @column.dateTime()
  declare endTime: DateTime

  @column()
  declare type: ScheduleType

  @column()
  declare setId: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Location)
  declare location: BelongsTo<typeof Location>

  @belongsTo(() => Set)
  declare set: BelongsTo<typeof Set>

  @belongsTo(() => ScheduleAssignment)
  declare scheduleAssignment: BelongsTo<typeof ScheduleAssignment>

  @belongsTo(() => Workday)
  declare workday: BelongsTo<typeof Workday>
}
