import type { HttpContext } from '@adonisjs/core/http'

export default class RenderController {
  async handle({ inertia }: HttpContext) {
    return inertia.render('Admin/Dashboard/Index')
  }
}
