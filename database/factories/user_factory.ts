import User from '#models/user'
import Factory from '@adonisjs/lucid/factories'

export const UserFactory = Factory.define(User, ({ faker }) => {
  return {
    fullName: faker.person.fullName(),
    email: faker.internet.email(),
    password: 'password',
  }
}).build()
