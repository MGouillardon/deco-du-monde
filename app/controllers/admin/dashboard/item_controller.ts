import Item from '#models/item'
import type { HttpContext } from '@adonisjs/core/http'

export default class ItemController {
  async index({ inertia }: HttpContext) {
    const title = 'Listing items'
    const items = await Item.all()
    return inertia.render('Admin/Dashboard/Items/Index', { title, items })
  }

  async create({}: HttpContext) {}

  async store({ request }: HttpContext) {}

  async show({ params }: HttpContext) {}

  async edit({ params }: HttpContext) {}

  async update({ params, request }: HttpContext) {}

  async destroy({ params }: HttpContext) {}
}
