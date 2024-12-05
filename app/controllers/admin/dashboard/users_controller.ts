import type { HttpContext } from '@adonisjs/core/http'
import Roles from '#enums/roles'
import Role from '#models/role'
import User from '#models/user'
import { storeUserValidator } from '#validators/dashboard/users/store'
import { updateUserValidator } from '#validators/dashboard/users/update'
import UserPolicy from '#policies/user_policy'

export default class UsersController {
  async index({ request, inertia, bouncer }: HttpContext) {
    await bouncer.with(UserPolicy).authorize('viewAny')

    const title = 'Listing'
    const page = request.input('page', 1)
    const limit = 10

    const users = await User.query()
      .withScopes((scopes) => scopes.withoutAdmin())
      .preload('role')
      .paginate(page, limit)

    return inertia.render('Admin/Dashboard/Users/Listing', {
      users,
      title,
      can: {
        create: await bouncer.with(UserPolicy).allows('create'),
        update: await bouncer.with(UserPolicy).allows('update'),
        delete: await bouncer.with(UserPolicy).allows('delete'),
      },
    })
  }

  async create({ inertia, bouncer }: HttpContext) {
    await bouncer.with(UserPolicy).authorize('create')

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

  async store({ request, session, response, bouncer }: HttpContext) {
    await bouncer.with(UserPolicy).authorize('create')

    const { fullName, email, password, roleId } = await request.validateUsing(storeUserValidator)
    await User.create({ fullName, email, password, roleId })

    session.flash('success', 'User created successfully')
    return response.redirect().toRoute('listing.user')
  }

  async edit({ inertia, params, bouncer }: HttpContext) {
    await bouncer.with(UserPolicy).authorize('update')

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

  async update({ params, request, response, session, bouncer }: HttpContext) {
    await bouncer.with(UserPolicy).authorize('update')

    const { fullName, email, password, roleId } = await request.validateUsing(updateUserValidator)
    const user = await User.findOrFail(params.id)

    user.merge({
      fullName,
      email,
      roleId,
      ...(password && { password }),
    })

    await user.save()

    session.flash('success', 'User updated successfully')
    return response.redirect().toRoute('listing.user')
  }

  async destroy({ params, response, session, bouncer }: HttpContext) {
    await bouncer.with(UserPolicy).authorize('delete')

    const user = await User.findOrFail(params.id)
    await user.delete()

    session.flash('success', 'User deleted successfully')
    return response.redirect().toRoute('listing.user')
  }
}
