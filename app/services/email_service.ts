import mail from '@adonisjs/mail/services/main'
import User from '#models/user'

export default class EmailService {
  async sendPasswordResetEmail(user: User, token: string) {
    const resetUrl = `${process.env.APP_URL}/admin/password/reset/${token}`

    await mail.send((message) => {
      message
        .from('noreply@example.com')
        .to(user.email)
        .subject('Reset Your Password')
        .htmlView('emails/reset_password', { user, resetUrl })
    })
  }
}
