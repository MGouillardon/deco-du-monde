import { inject } from '@adonisjs/core'
import User from '#models/user'
import EmailService from '#services/email_service'
import PasswordResetToken from '#models/password_reset_token'

@inject()
export default class PasswordResetService {
  constructor(private emailService: EmailService) {}

  async sendResetEmail(user: User, token: string): Promise<void> {
    await this.emailService.sendPasswordResetEmail(user, token)
  }

  async validateToken(token: string): Promise<PasswordResetToken | null> {
    return await PasswordResetToken.findValidToken(token)
  }

  async resetPassword(token: string, newPassword: string): Promise<User> {
    const resetToken = await this.validateToken(token)
    if (!resetToken) {
      throw new Error('Invalid or expired token')
    }

    const user = await User.findOrFail(resetToken.userId)
    user.password = newPassword
    user.isPasswordChanged = true
    await user.save()

    await resetToken.delete()

    return user
  }
}
