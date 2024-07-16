import vine from '@vinejs/vine'

export const storeUserValidator = vine.compile(
  vine.object({
    fullName: vine
      .string()
      .minLength(4)
      .unique(async (db, value) => {
        const user = await db.from('users').where('full_name', value).first()
        return !user
      }),
    email: vine
      .string()
      .email()
      .unique(async (db, value) => {
        const user = await db.from('users').where('email', value).first()
        return !user
      }),
    password: vine.string().minLength(8),
    roleId: vine.number().positive(),
  })
)
