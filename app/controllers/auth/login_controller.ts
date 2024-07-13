import User from '#models/user'
import { loginValidator } from '#validators/auth/login'
import type { HttpContext } from '@adonisjs/core/http'
import { errors } from '@adonisjs/auth'

export default class LoginController {
  async render({ inertia }: HttpContext) {
    return inertia.render('Admin/Login')
  }

  async login({ request, response, session, auth }: HttpContext) {
    try {
      const { email, password } = await request.validateUsing(loginValidator)
      const user = await User.verifyCredentials(email, password)
      await auth.use('web').login(user)

      session.flash('success', 'You have been logged in successfully!')
      return response.redirect().toRoute('inertia')
    } catch (error) {
      this.handleLoginError(error, session)
      return response.redirect().back()
    }
  }

  private handleLoginError(error: unknown, session: HttpContext['session']) {
    if (error instanceof errors.E_INVALID_CREDENTIALS) {
      session.flash('errors', 'Invalid email or password')
    } else {
      session.flash('errors', 'An unexpected error occurred. Please try again.')
    }
  }
}
