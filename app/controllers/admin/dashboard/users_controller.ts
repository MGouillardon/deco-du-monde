import Roles from '#enums/roles'
import Role from '#models/role'
import User from '#models/user'
import { storeUserValidator } from '#validators/dashboard/users/store'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  /**
   * Display a list of resource
   */
  async index({ request, inertia }: HttpContext) {
    const title = 'Listing'
    const page = request.input('page', 1)
    const limit = 10

    const users = await User.query()
      .withScopes((scopes) => scopes.nonAdmin())
      .preload('role')
      .paginate(page, limit)

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
  async store({ request, session, response }: HttpContext) {
    const { fullName, email, password, roleId } = await request.validateUsing(storeUserValidator)
    await User.create({ fullName, email, password, roleId })
    session.flash('success', 'User created successfully')
    return response.redirect().toRoute('listing.user')
  }

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
