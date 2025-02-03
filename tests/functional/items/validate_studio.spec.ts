import { test } from '@japa/runner'
import { createTestUser } from '../users/helpers/setup.js'
import { createBasicItem } from './helpers/setup.js'
import Roles from '#enums/roles'
import { LocationType } from '#enums/location_type'

test.group('Items validate studio photo', () => {
  test('photographer can validate studio photo when photographed', async ({
    client,
    route,
    assert,
  }) => {
    const photographer = await createTestUser(Roles.PHOTOGRAPH)
    const item = await createBasicItem()
    await item.merge({ isPhotographedStudio: true }).save()

    const response = await client
      .post(route('validate.item', [item.id]))
      .withCsrfToken()
      .withInertia()
      .loginAs(photographer)
      .header('Referer', route('show.item', [item.id]))
    response.assertStatus(200)
    response.assertRedirectsTo(route('show.item', [item.id]))

    const validation = await item
      .related('validations')
      .query()
      .where('type', LocationType.STUDIO)
      .firstOrFail()

    assert.equal(validation.isValidated, 1)
    assert.exists(validation.validatedAt)
    assert.equal(validation.userId, photographer.id)
  })

  test('cannot validate non-photographed item', async ({ client, route, assert }) => {
    const photographer = await createTestUser(Roles.PHOTOGRAPH)
    const item = await createBasicItem()
    await item.merge({ isPhotographedStudio: false }).save()

    const response = await client
      .post(route('validate.item', [item.id]))
      .withCsrfToken()
      .withInertia()
      .loginAs(photographer)
      .header('Referer', route('show.item', [item.id]))

    response.assertStatus(200)
    response.assertRedirectsTo(route('show.item', [item.id]))
    response.assertInertiaPropsContains({
      errors: 'Item must be photographed before validation',
    })

    const validation = await item
      .related('validations')
      .query()
      .where('type', LocationType.STUDIO)
      .firstOrFail()

    assert.equal(validation.isValidated, 0)
    assert.isNull(validation.validatedAt)
    assert.isNull(validation.userId)
  })

  test('decorator cannot validate studio photo', async ({ client, route }) => {
    const decorator = await createTestUser(Roles.DECORATOR)
    const item = await createBasicItem()
    await item.merge({ isPhotographedStudio: true }).save()

    const response = await client
      .post(route('validate.item', [item.id]))
      .withCsrfToken()
      .withInertia()
      .loginAs(decorator)

    response.assertStatus(403)
  })
})
