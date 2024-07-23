import type { HttpContext } from '@adonisjs/core/http'
import PasswordResetToken from '#models/password_reset_token'
import { resetPasswordValidator } from '#validators/auth/reset_password'
import User from '#models/user'

export default class PasswordResetController {
  async show({ params, inertia }: HttpContext) {
    const { token } = params
    return inertia.render('Admin/Auth/ResetPassword', { token })
  }

  async reset({ request, response, auth, session }: HttpContext) {
    const { token, password } = await request.validateUsing(resetPasswordValidator)

    try {
      const resetToken = await PasswordResetToken.findValidToken(token)
      if (!resetToken) {
        session.flash('errors', 'Invalid or expired token')
        return response.redirect().back()
      }

      const user = await User.findOrFail(resetToken.userId)
      user.password = password
      user.isPasswordChanged = true
      await user.save()

      await resetToken.delete()

      await auth.use('web').login(user)
      session.flash('success', 'Password reset successfully')
      return response.redirect().toRoute('dashboard')
    } catch (error) {
      console.error('Error in reset function:', error)
      session.flash('errors', 'An error occurred during password reset')
      return response.redirect().back()
    }
  }
}
