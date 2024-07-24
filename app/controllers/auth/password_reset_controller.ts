import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { resetPasswordValidator } from '#validators/auth/reset_password'
import PasswordResetService from '#services/password_reset_service'
import AuthService from '#services/auth_service'

@inject()
export default class PasswordResetController {
  constructor(
    private passwordResetService: PasswordResetService,
    private authService: AuthService
  ) {}

  async show({ params, inertia }: HttpContext) {
    const { token } = params
    console.log('Token:', token)
    return inertia.render('Admin/Auth/ResetPassword', { token })
  }

  async reset({ request, response, auth, session }: HttpContext) {
    const { token, password } = await request.validateUsing(resetPasswordValidator)

    try {
      const user = await this.passwordResetService.resetPassword(token, password)
      await this.authService.login(auth, user)

      session.flash('success', 'Password reset successfully')
      return response.redirect().toRoute('dashboard')
    } catch (error) {
      console.error('Error in reset function:', error)
      session.flash('errors', error.message || 'An error occurred during password reset')
      return response.redirect().back()
    }
  }
}
