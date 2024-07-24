import vine from '@vinejs/vine'

export const updateProfileValidator = (userId: number) =>
  vine.compile(
    vine.object({
      fullName: vine.string().minLength(4),
      email: vine
        .string()
        .email()
        .unique(async (db, value) => {
          const user = await db.from('users').where('email', value).whereNot('id', userId).first()
          return !user
        }),
    })
  )
