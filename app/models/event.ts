import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Location from '#models/location'
import EventAssignment from '#models/event_assignment'
import Workday from '#models/workday'
import Set from '#models/set'
import { EventType } from '#enums/event_type'

export default class Event extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare locationId: number

  @column.dateTime()
  declare startTime: DateTime

  @column.dateTime()
  declare endTime: DateTime

  @column()
  declare type: EventType

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

  @belongsTo(() => EventAssignment)
  declare eventAssignment: BelongsTo<typeof EventAssignment>

  @belongsTo(() => Workday)
  declare workday: BelongsTo<typeof Workday>
}
