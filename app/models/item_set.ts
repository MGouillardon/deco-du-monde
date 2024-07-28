import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ItemSet extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare setId: number

  @column()
  declare itemId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}
