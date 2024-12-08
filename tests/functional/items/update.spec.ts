import { test } from '@japa/runner'
import { createAdminUser, createTestUser } from '../users/helpers/setup.js'
import { createBasicItem, testItemData } from './helpers/setup.js'
import Roles from '#enums/roles'
import { ItemStatusType } from '#enums/item_status'

test.group('Items update', () => {
  test('admin can update item', async ({ client, route, assert }) => {
    const admin = await createAdminUser()
    const item = await createBasicItem()

    const updateData = {
      ...testItemData,
      name: 'Updated Name',
      description: 'Updated Description',
      status: ItemStatusType.STUDIO_SCHEDULED,
      notes: 'Test notes',
    }

    const response = await client
      .put(route('update.item', [item.id]))
      .withCsrfToken()
      .withInertia()
      .loginAs(admin)
      .form(updateData)

    response.assertStatus(200)
    response.assertInertiaPropsContains({
      success: 'Item updated successfully',
    })

    const updatedItem = await item.refresh()
    assert.equal(updatedItem.name, updateData.name)
    assert.equal(updatedItem.description, updateData.description)

    const status = await updatedItem.related('itemStatus').query().firstOrFail()
    assert.equal(status.status, updateData.status)
    assert.equal(status.notes, updateData.notes)
  })

  test('photographer can update item', async ({ client, route }) => {
    const photographer = await createTestUser(Roles.PHOTOGRAPH)
    const item = await createBasicItem()

    const updateData = {
      ...testItemData,
      name: 'Updated Name',
      description: 'Updated Description',
      status: ItemStatusType.STUDIO_SCHEDULED,
      notes: 'Test notes',
    }

    const response = await client
      .put(route('update.item', [item.id]))
      .withCsrfToken()
      .withInertia()
      .loginAs(photographer)
      .form(updateData)

    response.assertStatus(200)
    response.assertInertiaPropsContains({
      success: 'Item updated successfully',
    })
  })

  test('decorator cannot update item', async ({ client, route }) => {
    const decorator = await createTestUser(Roles.DECORATOR)
    const item = await createBasicItem()

    const response = await client
      .put(route('update.item', [item.id]))
      .withCsrfToken()
      .withInertia()
      .loginAs(decorator)
      .form(testItemData)

    response.assertStatus(403)
  })
})
