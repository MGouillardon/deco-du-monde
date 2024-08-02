import { ItemStatusType } from '#enums/item_status'
import { LocationType } from '#enums/location_type'
import Item from '#models/item'
import ItemStatus from '#models/item_status'
import ItemValidation from '#models/item_validation'
import { storeItemValidator } from '#validators/dashboard/items/store'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class ItemController {
  async index({ request, inertia }: HttpContext) {
    const title = 'Listing items'
    const page = request.input('page', 1)
    const limit = 10
    const items = await Item.query()
      .preload('itemStatus')
      .preload('validations')
      .preload('sets')
      .paginate(page, limit)
    return inertia.render('Admin/Dashboard/Items/Index', { title, items })
  }

  async create({ inertia }: HttpContext) {
    const title = 'Create a new item'
    return inertia.render('Admin/Dashboard/Items/Create', { title })
  }

  async store({ request, session, response }: HttpContext) {
    const { name, description } = await request.validateUsing(storeItemValidator)
    await db.transaction(async (trx) => {
      const item = await Item.create(
        {
          name,
          description,
          isPhotographedStudio: false,
        },
        { client: trx }
      )

      await Promise.all([
        ItemStatus.create(
          {
            itemId: item.id,
            status: ItemStatusType.NORMAL,
          },
          { client: trx }
        ),
        ItemValidation.create(
          {
            itemId: item.id,
            type: LocationType.STUDIO,
            isValidated: false,
          },
          { client: trx }
        ),
      ])

      return item
    })
    session.flash('success', 'Item created successfully')
    return response.redirect().toRoute('listing.item')
  }

  async show({ params }: HttpContext) {}

  async edit({ params }: HttpContext) {}

  async update({ params, request }: HttpContext) {}

  async destroy({ params }: HttpContext) {}
}
