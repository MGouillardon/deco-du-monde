import { ItemStatusType } from '#enums/item_status'
import { LocationType } from '#enums/location_type'
import Item from '#models/item'
import ItemStatus from '#models/item_status'
import ItemValidation from '#models/item_validation'
import Set from '#models/set'
import { storeItemValidator } from '#validators/dashboard/items/store'
import { updateItemValidator } from '#validators/dashboard/items/update'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class ItemController {
  async index({ request, inertia }: HttpContext) {
    const page = request.input('page', 1)
    const limit = 10
    const items = await Item.query()
      .preload('itemStatus')
      .preload('validations')
      .preload('sets')
      .paginate(page, limit)
    return inertia.render('Admin/Dashboard/Items/Index', { title: 'Listing items', items })
  }

  async create({ inertia }: HttpContext) {
    return inertia.render('Admin/Dashboard/Items/Create', { title: 'Create a new item' })
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

  async show({ params, inertia }: HttpContext) {
    const item = await Item.query()
      .where('id', params.id)
      .preload('itemStatus')
      .preload('validations', (query) => {
        query.preload('user')
      })
      .preload('sets')
      .firstOrFail()
    const title = `Show item: ${item.name}`
    return inertia.render('Admin/Dashboard/Items/Show', { title, item })
  }

  async edit({ params, inertia }: HttpContext) {
    const item = await Item.query()
      .where('id', params.id)
      .preload('itemStatus')
      .preload('validations', (query) => {
        query.preload('user')
      })
      .preload('sets')
      .firstOrFail()

    const title = `Edit item: ${item.name}`
    const statusOptions = Object.values(ItemStatusType)
    const allSets = await Set.all()

    return inertia.render('Admin/Dashboard/Items/Edit', {
      title,
      item,
      statusOptions,
      allSets: allSets.map((set) => ({ id: set.id, name: set.name })),
    })
  }

  async update({ params, request, session, response }: HttpContext) {
    const { id } = params
    const validatedData = await request.validateUsing(updateItemValidator)

    await db.transaction(async (trx) => {
      const item = await this.getItemWithRelations(id, trx)
      await this.updateItemDetails(item, validatedData, trx)
      await this.updateOrCreateItemStatus(item, validatedData, trx)
      await this.syncItemSets(item, validatedData.setIds, trx)
    })

    session.flash('success', 'Item updated successfully')
    return response.redirect().toRoute('listing.item')
  }

  private async getItemWithRelations(id: number, trx: any) {
    return Item.query({ client: trx })
      .where('id', id)
      .preload('itemStatus')
      .preload('sets')
      .firstOrFail()
  }

  private async updateItemDetails(item: Item, data: any) {
    item.merge({
      name: data.name,
      description: data.description,
      isPhotographedStudio: data.isPhotographedStudio,
    })
    await item.save()
  }

  private async updateOrCreateItemStatus(item: Item, data: any, trx: any) {
    if (item.itemStatus) {
      item.itemStatus.merge({
        status: data.status,
        notes: data.notes,
      })
      await item.itemStatus.save()
    } else {
      await ItemStatus.create(
        {
          itemId: item.id,
          status: data.status,
          notes: data.notes,
        },
        { client: trx }
      )
    }
  }

  private async syncItemSets(item: Item, setIds: number[] | undefined) {
    if (setIds) {
      await item.related('sets').sync(setIds)
    }
  }

  async destroy({ params, session, response }: HttpContext) {
    const { id } = params
    const item = await Item.findOrFail(id)
    await item.delete()

    session.flash('success', 'Item deleted successfully')
    return response.redirect().toRoute('listing.item')
  }
}
