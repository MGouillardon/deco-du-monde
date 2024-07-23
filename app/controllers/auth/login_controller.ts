import User from '#models/user'
import { loginValidator } from '#validators/auth/login'
import type { HttpContext } from '@adonisjs/core/http'
import { errors } from '@adonisjs/auth'
import mail from '@adonisjs/mail/services/main'

export default class LoginController {
  async render({ inertia }: HttpContext) {
    return inertia.render('Admin/Auth/Login')
  }

  async login({ request, response, session, auth }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    try {
      const user = await User.verifyCredentials(email, password)

      if (!user.isPasswordChanged) {
        const resetToken = await user.initiatePasswordReset()
        await this.sendPasswordResetEmail(user, resetToken.token)
        session.flash('info', 'Please check your email to reset your password.')
        return response.redirect().back()
      }

      await auth.use('web').login(user)
      return response.redirect().toRoute('dashboard')
    } catch (error) {
      this.handleLoginError(error, session)
      return response.redirect().back()
    }
  }

  private async sendPasswordResetEmail(user: User, token: string) {
    const resetUrl = `${process.env.APP_URL}/admin/password/reset/${token}`

    await mail.send((message) => {
      message
        .from('noreply@example.com')
        .to(user.email)
        .subject('Reset Your Password')
        .htmlView('emails/reset_password', { user, resetUrl })
    })
  }

  private handleLoginError(error: unknown, session: HttpContext['session']) {
    if (error instanceof errors.E_INVALID_CREDENTIALS) {
      session.flash('errors', 'Invalid email or password')
    } else {
      session.flash('errors', 'An unexpected error occurred. Please try again.')
    }
  }
}
