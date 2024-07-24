import type { HttpContext } from '@adonisjs/core/http'
import { loginValidator } from '#validators/auth/login'
import AuthService from '#services/auth_service'
import { inject } from '@adonisjs/core'

@inject()
export default class LoginController {
  constructor(private authService: AuthService) {}

  async render({ inertia }: HttpContext) {
    return inertia.render('Admin/Auth/Login')
  }

  async login({ request, response, session, auth }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    try {
      const user = await this.authService.verifyCredentials(email, password)

      if (!user.isPasswordChanged) {
        await this.authService.handlePasswordReset(user)
        session.flash('info', 'Please check your email to reset your password.')
        return response.redirect().back()
      }

      await this.authService.login(auth, user)
      session.flash('success', 'You have successfully logged in.')
      return response.redirect().toRoute('dashboard')
    } catch (error) {
      session.flash('errors', error.message)
      return response.redirect().back()
    }
  }
}
