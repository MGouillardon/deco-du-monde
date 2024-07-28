import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { SetValidationType } from '#enums/set_validation_type'
import Set from '#models/set'
import User from '#models/user'

export default class SetValidation extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare setId: number

  @column()
  declare userId: number

  @column()
  declare type: SetValidationType

  @column()
  declare isValidated: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Set)
  declare set: BelongsTo<typeof Set>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
