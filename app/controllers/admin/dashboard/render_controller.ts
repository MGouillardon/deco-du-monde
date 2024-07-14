import type { HttpContext } from '@adonisjs/core/http'

export default class RenderController {
  async index({ inertia }: HttpContext) {
    return inertia.render('Admin/Dashboard/Index')
  }
}
