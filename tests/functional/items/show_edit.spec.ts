import { test } from '@japa/runner'
import { createAdminUser, createTestUser } from '../users/helpers/setup.js'
import { createBasicItem } from './helpers/setup.js'
import Roles from '#enums/roles'
import { ItemStatusType } from '#enums/item_status'

test.group('Items show/edit', () => {
  test('admin can view item details', async ({ client, route }) => {
    const admin = await createAdminUser()
    const item = await createBasicItem()

    const response = await client
      .get(route('show.item', [item.id]))
      .withInertia()
      .loginAs(admin)

    response.assertStatus(200)
    response.assertInertiaComponent('Admin/Dashboard/Items/Show')
    response.assertInertiaPropsContains({
      title: `Show item: ${item.name}`,
      item: {
        id: item.id,
        name: item.name,
        description: item.description,
      },
    })
  })

  test('anyone can view item details', async ({ client, route }) => {
    const decorator = await createTestUser(Roles.DECORATOR)
    const item = await createBasicItem()

    const response = await client
      .get(route('show.item', [item.id]))
      .withInertia()
      .loginAs(decorator)

    response.assertStatus(200)
    response.assertInertiaComponent('Admin/Dashboard/Items/Show')
  })

  test('admin can access edit form', async ({ client, route }) => {
    const admin = await createAdminUser()
    const item = await createBasicItem()

    const response = await client
      .get(route('edit.item', [item.id]))
      .withInertia()
      .loginAs(admin)

    response.assertStatus(200)
    response.assertInertiaComponent('Admin/Dashboard/Items/Edit')
    response.assertInertiaPropsContains({
      title: `Edit item: ${item.name}`,
      statusOptions: Object.values(ItemStatusType),
    })
  })

  test('photographer can access edit form', async ({ client, route }) => {
    const photographer = await createTestUser(Roles.PHOTOGRAPH)
    const item = await createBasicItem()

    const response = await client
      .get(route('edit.item', [item.id]))
      .withInertia()
      .loginAs(photographer)

    response.assertStatus(200)
    response.assertInertiaComponent('Admin/Dashboard/Items/Edit')
  })

  test('decorator cannot access edit form', async ({ client, route }) => {
    const decorator = await createTestUser(Roles.DECORATOR)
    const item = await createBasicItem()

    const response = await client
      .get(route('edit.item', [item.id]))
      .withInertia()
      .loginAs(decorator)

    response.assertStatus(403)
  })

  test('returns 404 for non-existent item', async ({ client, route }) => {
    const admin = await createAdminUser()

    const response = await client
      .get(route('show.item', [9999]))
      .withInertia()
      .loginAs(admin)

    response.assertStatus(404)
  })
})
