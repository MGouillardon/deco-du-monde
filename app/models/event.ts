import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany, computed, scope } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import Location from '#models/location'
import EventAssignment from '#models/event_assignment'
import Workday from '#models/workday'
import Set from '#models/set'
import { EventType } from '#enums/event_type'
import { ItemStatusType } from '#enums/item_status'
import Item from '#models/item'
import string from '@adonisjs/core/helpers/string'

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

  @column()
  declare completed: boolean

  @column.dateTime()
  declare completedAt: DateTime | null

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

  async complete(trx?: any) {
    this.completed = true
    this.completedAt = DateTime.now()
    await this.save()

    if (this.itemId) {
      const item = await Item.findOrFail(this.itemId)
      await this.updateItemStatus(item, trx)
    }
  }

  private async updateItemStatus(item: Item, trx?: any) {
    const newStatus = this.determineNewItemStatus()
    if (newStatus) {
      await item.related('itemStatus').create(
        {
          status: newStatus,
        },
        trx ? { client: trx } : undefined
      )
    }
  }

  private determineNewItemStatus(): ItemStatusType | null {
    switch (this.type) {
      case EventType.STUDIO_SHOOT:
        return ItemStatusType.STUDIO_COMPLETED
      case EventType.SET_SHOOT:
        return ItemStatusType.SET_COMPLETED
      default:
        return null
    }
  }

  @computed()
  get title() {
    const entityName = this.type === EventType.STUDIO_SHOOT ? this.item?.name : this.set?.name
    const title = `${this.type.replace('_', ' ')} - ${entityName ?? ''}`.trim()
    return string.capitalCase(title)
  }

  static withDetails = scope((query: ModelQueryBuilderContract<typeof Event>) => {
    query
      .preload('location')
      .preload('set')
      .preload('item')
      .preload('eventAssignments', (eventAssignmentsQuery) =>
        eventAssignmentsQuery.preload('user', (userQuery) => userQuery.preload('role'))
      )
  })
}
