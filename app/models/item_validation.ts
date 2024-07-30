import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, computed } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Item from '#models/item'
import { LocationType } from '#enums/location_type'

export default class ItemValidation extends BaseModel {
  static primaryKey = 'id'
  static table = 'item_validations'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare itemId: number

  @column()
  declare userId: number | null

  @column()
  declare type: LocationType

  @column()
  declare isValidated: boolean

  @column.dateTime()
  declare validatedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Item)
  declare item: BelongsTo<typeof Item>

  @computed()
  get compositeKey() {
    return `${this.itemId}-${this.userId}`
  }

  static async findByCompositeKey(itemId: number, userId: number) {
    return this.query().where('itemId', itemId).where('userId', userId).first()
  }
}
