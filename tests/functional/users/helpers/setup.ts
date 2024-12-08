import { UserFactory } from '#factories/user_factory'
import Roles from '#enums/roles'

export async function createAdminUser() {
  return await UserFactory.merge({ roleId: Roles.ADMIN }).create()
}

export async function createTestUser(roleId = Roles.PHOTOGRAPH) {
  return await UserFactory.merge({ roleId }).create()
}

export const testUserData = {
  fullName: 'Test User',
  email: 'test@example.com',
  password: 'password123',
}
