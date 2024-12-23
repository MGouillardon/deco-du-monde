import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, belongsTo, column, computed, hasMany, scope } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Role from '#models/role'
import Roles from '#enums/roles'
import PasswordResetToken from '#models/password_reset_token'
import Workday from '#models/workday'
import EventAssignment from '#models/event_assignment'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare roleId: number

  @column()
  declare isPasswordChanged: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Role)
  declare role: BelongsTo<typeof Role>

  @hasMany(() => PasswordResetToken)
  declare passwordResetTokens: HasMany<typeof PasswordResetToken>

  @hasMany(() => Workday)
  declare workdays: HasMany<typeof Workday>

  @hasMany(() => EventAssignment)
  declare eventAssignments: HasMany<typeof EventAssignment>

  @computed()
  get roleName() {
    return Role.getDisplayName(this.role?.name || '')
  }

  static withoutAdmin = scope((query) => {
    query.where('role_id', '!=', Roles.ADMIN)
  })

  static groupUsersByRole(users: User[]): { [key: string]: User[] } {
    return users.reduce(
      (acc, user) => {
        const roleName = user.role.name.toLowerCase()
        ;(acc[roleName] ??= []).push(user)
        return acc
      },
      {} as { [key: string]: User[] }
    )
  }

  async initiatePasswordReset(): Promise<PasswordResetToken> {
    await PasswordResetToken.query().where('user_id', this.id).delete()
    return PasswordResetToken.generateToken(this)
  }

  serialize() {
    return {
      id: this.id,
      fullName: this.fullName,
      email: this.email,
      roleName: this.roleName,
      isPasswordChanged: this.isPasswordChanged,
    }
  }
}
