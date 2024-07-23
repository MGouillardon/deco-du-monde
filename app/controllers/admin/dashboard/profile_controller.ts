import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProfileController {
  async show({ inertia, params, auth, response }: HttpContext) {
    const title = 'Profile'
    const user = await User.findOrFail(params.id)

    if (auth.user!.id !== user.id) {
      return response.redirect().back()
    }

    return inertia.render('Admin/Dashboard/Profile/Show', { user, title })
  }

  async update() {}
}
