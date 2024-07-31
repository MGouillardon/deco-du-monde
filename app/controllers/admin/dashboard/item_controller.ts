import Item from '#models/item'
import type { HttpContext } from '@adonisjs/core/http'

export default class ItemController {
  async index({ request, inertia }: HttpContext) {
    const title = 'Listing items'
    const page = request.input('page', 1)
    const limit = 10
    const items = await Item.query()
      .preload('status', (query) => query.select('status'))
      .preload('sets', (query) => query.select('id', 'name', 'is_photographed'))
      .paginate(page, limit)
    return inertia.render('Admin/Dashboard/Items/Index', { title, items })
  }

  async create({}: HttpContext) {}

  async store({ request }: HttpContext) {}

  async show({ params }: HttpContext) {}

  async edit({ params }: HttpContext) {}

  async update({ params, request }: HttpContext) {}

  async destroy({ params }: HttpContext) {}
}
