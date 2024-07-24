import { inject } from '@adonisjs/core'
import User from '#models/user'
import { errors } from '@adonisjs/auth'
import PasswordResetService from '#services/password_reset_service'

@inject()
export default class AuthService {
  constructor(private passwordResetService: PasswordResetService) {}

  async verifyCredentials(email: string, password: string): Promise<User> {
    try {
      return await User.verifyCredentials(email, password)
    } catch (error) {
      if (error instanceof errors.E_INVALID_CREDENTIALS) {
        throw new Error('Invalid email or password')
      }
      throw new Error('An unexpected error occurred during authentication')
    }
  }

  async login(auth: any, user: User): Promise<void> {
    await auth.use('web').login(user)
  }

  async handlePasswordReset(user: User): Promise<void> {
    const resetToken = await user.initiatePasswordReset()
    await this.passwordResetService.sendResetEmail(user, resetToken.token)
  }
}
