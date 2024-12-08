import { test } from '@japa/runner'
import { createAdminUser, createTestUser } from '../users/helpers/setup.js'
import { createBasicItem } from './helpers/setup.js'
import Roles from '#enums/roles'
import Database from '@adonisjs/lucid/services/db'
import Item from '#models/item'

test.group('Items delete', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('admin can delete item', async ({ client, route, assert }) => {
    const admin = await createAdminUser()
    const item = await createBasicItem()

    const response = await client
      .delete(route('delete.item', [item.id]))
      .withCsrfToken()
      .withInertia()
      .loginAs(admin)
      .header('Referer', route('listing.item'))

    response.assertStatus(200)
    response.assertRedirectsTo(route('listing.item'))

    const deletedItem = await Item.find(item.id)
    assert.isNull(deletedItem, 'Item should be deleted')
  })

  test('non-admin cannot delete item', async ({ client, route, assert }) => {
    const photographer = await createTestUser(Roles.PHOTOGRAPH)
    const item = await createBasicItem()

    const response = await client
      .delete(route('delete.item', [item.id]))
      .withCsrfToken()
      .withInertia()
      .loginAs(photographer)

    response.assertStatus(403)

    const itemStillExists = await Item.find(item.id)
    assert.isNotNull(itemStillExists)
  })
})
