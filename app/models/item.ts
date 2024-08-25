import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, hasOne, manyToMany } from '@adonisjs/lucid/orm'
import type { HasMany, HasOne, ManyToMany } from '@adonisjs/lucid/types/relations'
import ItemStatus from '#models/item_status'
import ItemValidation from '#models/item_validation'
import Set from '#models/set'

export default class Item extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare isPhotographedStudio: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasOne(() => ItemStatus)
  declare itemStatus: HasOne<typeof ItemStatus>

  @hasMany(() => ItemValidation)
  declare validations: HasMany<typeof ItemValidation>

  @manyToMany(() => Set, {
    pivotTable: 'item_sets',
  })
  declare sets: ManyToMany<typeof Set>
}
