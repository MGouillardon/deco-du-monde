import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import ItemStatus from './item_status.js'
import ItemValidation from './item_validation.js'
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

  @hasMany(() => ItemStatus)
  declare statuses: HasMany<typeof ItemStatus>

  @hasMany(() => ItemValidation)
  declare validations: HasMany<typeof ItemValidation>

  @manyToMany(() => Set, {
    pivotTable: 'item_sets',
  })
  declare sets: ManyToMany<typeof Set>
}
