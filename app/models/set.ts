import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Item from '#models/item'
import SetValidation from '#models/set_validation'
import Schedule from '#models/schedule'

export default class Set extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare isPhotographed: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @manyToMany(() => Item, {
    pivotTable: 'item_sets',
  })
  declare items: ManyToMany<typeof Item>

  @hasMany(() => SetValidation)
  declare validations: HasMany<typeof SetValidation>

  @hasMany(() => Schedule)
  declare schedules: HasMany<typeof Schedule>
}
