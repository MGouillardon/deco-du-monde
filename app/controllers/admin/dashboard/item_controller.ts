import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { ItemStatusType } from '#enums/item_status'
import { LocationType } from '#enums/location_type'
import Item from '#models/item'
import Set from '#models/set'
import { storeItemValidator } from '#validators/dashboard/items/store'
import { updateItemValidator } from '#validators/dashboard/items/update'
import ItemPolicy from '#policies/item_policy'

export default class ItemController {
  async index({ request, inertia, bouncer }: HttpContext) {
    await bouncer.with(ItemPolicy).authorize('viewAny')

    const page = request.input('page', 1)
    const items = await Item.query()
      .preload('itemStatus')
      .preload('validations')
      .preload('sets')
      .paginate(page, 10)

    return inertia.render('Admin/Dashboard/Items/Index', {
      title: 'Listing items',
      items,
    })
  }

  async show({ params, inertia, bouncer }: HttpContext) {
    const item = await Item.query()
      .where('id', params.id)
      .preload('itemStatus')
      .preload('validations', (query) => {
        query.preload('user')
      })
      .preload('sets')
      .firstOrFail()

    await bouncer.with(ItemPolicy).authorize('view')

    return inertia.render('Admin/Dashboard/Items/Show', {
      title: `Show item: ${item.name}`,
      item,
    })
  }

  async edit({ params, inertia, bouncer }: HttpContext) {
    const [item, allSets] = await Promise.all([
      Item.query()
        .where('id', params.id)
        .preload('itemStatus')
        .preload('validations', (query) => {
          query.preload('user')
        })
        .preload('sets')
        .firstOrFail(),
      Set.query().select('id', 'name').orderBy('name'),
    ])

    await bouncer.with(ItemPolicy).authorize('update')

    return inertia.render('Admin/Dashboard/Items/Edit', {
      title: `Edit item: ${item.name}`,
      item,
      statusOptions: Object.values(ItemStatusType),
      allSets: allSets.map((set) => ({ id: set.id, name: set.name })),
    })
  }

  async store({ request, session, response, bouncer }: HttpContext) {
    await bouncer.with(ItemPolicy).authorize('create')

    const validatedData = await request.validateUsing(storeItemValidator)
    await db.transaction(async () => {
      const newItem = await Item.create({
        name: validatedData.name,
        description: validatedData.description,
        isPhotographedStudio: false,
      })

      await Promise.all([
        newItem.related('itemStatus').create({
          status: ItemStatusType.NORMAL,
        }),
        newItem.related('validations').createMany([
          {
            type: LocationType.STUDIO,
            isValidated: false,
          },
        ]),
      ])

      return newItem
    })

    session.flash('success', 'Item created successfully')
    return response.redirect().toRoute('listing.item')
  }

  async update({ params, request, session, response, bouncer }: HttpContext) {
    const item = await Item.query()
      .where('id', params.id)
      .preload('itemStatus')
      .preload('sets')
      .firstOrFail()

    await bouncer.with(ItemPolicy).authorize('update')

    const validatedData = await request.validateUsing(updateItemValidator)

    item.merge({
      name: validatedData.name,
      description: validatedData.description,
      isPhotographedStudio: validatedData.isPhotographedStudio,
    })
    await item.save()

    await item.related('itemStatus').updateOrCreate(
      { itemId: item.id },
      {
        status: validatedData.status,
        notes: validatedData.notes,
      }
    )

    if (validatedData.setIds) {
      await item.related('sets').sync(validatedData.setIds)
    }

    session.flash('success', 'Item updated successfully')
    return response.redirect().toRoute('listing.item')
  }
}
