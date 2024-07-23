import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class PasswordResetToken extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare token: string

  @column.dateTime({ autoCreate: false })
  declare expiresAt: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  static async generateToken(user: User): Promise<PasswordResetToken> {
    const token = crypto.randomUUID()
    const expiresAt = DateTime.now().plus({ hours: 24 })

    const resetToken = await PasswordResetToken.create({
      userId: user.id,
      token,
      expiresAt,
    })

    return resetToken
  }

  static async findValidToken(token: string): Promise<PasswordResetToken | null> {
    return PasswordResetToken.query()
      .where('token', token)
      .where('expires_at', '>', DateTime.now().toSQL())
      .first()
  }
}
