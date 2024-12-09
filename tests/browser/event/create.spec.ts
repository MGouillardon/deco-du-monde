import { test } from '@japa/runner'
import { createTestUser } from '../../functional/users/helpers/setup.js'
import Roles from '#enums/roles'

test.group('Event creation flow', () => {
  test('decorator can create a set preparation event', async ({ visit }) => {
    const decorator = await createTestUser(Roles.DECORATOR)
    console.log('Test user created:', decorator.email)

    const page = await visit('/admin/login')
    await page.waitForLoadState('networkidle')

    try {
      await page.locator('#email').fill(decorator.email)
      console.log('Email filled')

      await page.locator('#password').fill('password')
      console.log('Password filled')

      await page.locator('button[type="submit"]').click()
      console.log('Submit clicked')

      await page.waitForURL('/admin/dashboard/events')
    } catch (error) {
      console.error('Test failed:', error)
      await page.screenshot({ path: 'test-failure.png' })
      throw error
    }
  }).timeout(60000)
})
