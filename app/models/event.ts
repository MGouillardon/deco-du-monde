import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Location from '#models/location'
import EventAssignment from '#models/event_assignment'
import Workday from '#models/workday'
import Set from '#models/set'
import { EventType } from '#enums/event_type'
import Item from '#models/item'

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
  declare itemId: number | null

  @column()
  declare setId: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Location)
  declare location: BelongsTo<typeof Location>

  @belongsTo(() => Item)
  declare item: BelongsTo<typeof Item>

  @belongsTo(() => Set)
  declare set: BelongsTo<typeof Set>

  @hasMany(() => EventAssignment)
  declare eventAssignments: HasMany<typeof EventAssignment>

  @belongsTo(() => Workday)
  declare workday: BelongsTo<typeof Workday>
}
