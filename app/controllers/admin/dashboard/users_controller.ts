import Roles from '#enums/roles'
import Role from '#models/role'
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  /**
   * Display a list of resource
   */
  async index({ inertia }: HttpContext) {
    const title = 'Listing'
    const users = await User.query()
      .withScopes((scopes) => scopes.nonAdmin())
      .preload('role')

    return inertia.render('Admin/Dashboard/Users/Listing', { users, title })
  }

  /**
   * Display form to create a new record
   */
  async create({ inertia }: HttpContext) {
    const title = 'Create User'
    const roles = await Role.query().whereNot('id', Roles.ADMIN).orderBy('id', 'desc')

    return inertia.render('Admin/Dashboard/Users/Create', {
      title,
      roles: roles.map((role) => ({
        id: role.id,
        name: role.displayName,
        value: role.name,
      })),
    })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {}

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {}

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}
