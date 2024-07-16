import Roles from '#enums/roles'
import Role from '#models/role'
import User from '#models/user'
import { storeUserValidator } from '#validators/dashboard/users/store'
import { updateUserValidator } from '#validators/dashboard/users/update'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
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

  async store({ request, session, response }: HttpContext) {
    const { fullName, email, password, roleId } = await request.validateUsing(storeUserValidator)
    await User.create({ fullName, email, password, roleId })
    session.flash('success', 'User created successfully')
    return response.redirect().toRoute('listing.user')
  }

  async show({ params }: HttpContext) {}

  async edit({ inertia, params }: HttpContext) {
    const title = 'Edit User'
    const user = await User.query().where('id', params.id).preload('role').firstOrFail()
    const roles = await Role.query().whereNot('id', Roles.ADMIN).orderBy('id', 'desc')

    return inertia.render('Admin/Dashboard/Users/Edit', {
      title,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        roleId: user.role.id,
      },
      roles: roles.map((role) => ({
        id: role.id,
        name: role.displayName,
        value: role.name,
      })),
    })
  }

  async update({ params, request, response, session }: HttpContext) {
    const { fullName, email, password, roleId } = await request.validateUsing(updateUserValidator)
    const user = await User.findOrFail(params.id)
    user.fullName = fullName
    user.email = email
    user.roleId = roleId
    if (password) {
      user.password = password
    }
    await user.save()
    session.flash('success', 'User updated successfully')
    return response.redirect().toRoute('listing.user')
  }

  async destroy({ params }: HttpContext) {}
}
