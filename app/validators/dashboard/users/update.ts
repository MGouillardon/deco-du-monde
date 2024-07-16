import vine from '@vinejs/vine'
import Roles from '#enums/roles'

const validRoleIds = Object.values(Roles).filter(
  (role): role is number => typeof role === 'number' && role !== Roles.ADMIN
)
export const updateUserValidator = vine.compile(
  vine.object({
    fullName: vine.string().minLength(4),
    email: vine.string().email(),
    password: vine.string().minLength(8).optional(),
    roleId: vine.number().in(validRoleIds),
  })
)
