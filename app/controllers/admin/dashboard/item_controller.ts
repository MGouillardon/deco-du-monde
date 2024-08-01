import Item from '#models/item'
import type { HttpContext } from '@adonisjs/core/http'

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

  async store({ request }: HttpContext) {}

  async show({ params }: HttpContext) {}

  async edit({ params }: HttpContext) {}

  async update({ params, request }: HttpContext) {}

  async destroy({ params }: HttpContext) {}
}
