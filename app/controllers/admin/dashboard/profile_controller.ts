import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProfileController {
  async show({ inertia, params, auth, response }: HttpContext) {
    const user = await this.getUserWithRole(params.id)

    if (auth.user!.id !== user.id) {
      return response.forbidden('You are not authorized to view this profile')
    }

    return inertia.render('Admin/Dashboard/Profile/Show', {
      title: 'Profile',
      user: user.serialize(),
    })
  }

  private async getUserWithRole(id: number): Promise<User> {
    return User.query().where('id', id).preload('role').firstOrFail()
  }

  async update() {}
}
