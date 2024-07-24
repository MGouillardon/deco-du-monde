import User from '#models/user'
import { updateProfileValidator } from '#validators/dashboard/profile/update'
import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import PasswordResetService from '#services/password_reset_service'

@inject()
export default class ProfileController {
  constructor(private passwordResetService: PasswordResetService) {}

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

  async update({ request, response, session }: HttpContext) {
    const { id } = request.params()
    const user = await User.findOrFail(id)
    const { fullName, email } = await request.validateUsing(updateProfileValidator(user.id))

    user.fullName = fullName
    user.email = email
    await user.save()

    session.flash('success', 'Profile updated successfully')
    return response.redirect().back()
  }

  async requestPasswordReset({ params, response, session }: HttpContext) {
    const user = await this.getUserWithRole(params.id)

    try {
      const resetToken = await user.initiatePasswordReset()
      await this.passwordResetService.sendResetEmail(user, resetToken.token)
      session.flash('info', 'Password reset instructions have been sent to your email.')
    } catch (error) {
      console.error('Error requesting password reset:', error)
      session.flash('error', 'An error occurred while requesting password reset. Please try again.')
    }

    return response.redirect().back()
  }

  private async getUserWithRole(id: number): Promise<User> {
    return User.query().where('id', id).preload('role').firstOrFail()
  }
}
