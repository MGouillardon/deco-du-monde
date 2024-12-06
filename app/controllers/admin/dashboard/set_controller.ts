import { HttpContext } from '@adonisjs/core/http'
import Set from '#models/set'
import Item from '#models/item'
import db from '@adonisjs/lucid/services/db'
import { storeSetValidator } from '#validators/dashboard/sets/store'
import { updateSetValidator } from '#validators/dashboard/sets/update'
import SetPolicy from '#policies/set_policy'

export default class SetController {
  async index({ request, inertia, bouncer }: HttpContext) {
    await bouncer.with(SetPolicy).authorize('viewAny')

    const title = 'Listing Sets'
    const page = request.input('page', 1)
    const limit = 10
    const sets = await Set.query().preload('items').preload('validations').paginate(page, limit)

    return inertia.render('Admin/Dashboard/Sets/Index', {
      title,
      sets,
      can: {
        create: await bouncer.with(SetPolicy).allows('create'),
        update: await bouncer.with(SetPolicy).allows('update'),
        delete: await bouncer.with(SetPolicy).allows('delete'),
        validateInstallation: await bouncer.with(SetPolicy).allows('validateInstallation'),
        validateUninstallation: await bouncer.with(SetPolicy).allows('validateUninstallation'),
        validatePhotography: await bouncer.with(SetPolicy).allows('validatePhotography'),
      },
    })
  }

  async create({ inertia, bouncer }: HttpContext) {
    await bouncer.with(SetPolicy).authorize('create')

    const items = await Item.all()
    return inertia.render('Admin/Dashboard/Sets/Create', { items })
  }

  async store({ request, response, session, bouncer }: HttpContext) {
    await bouncer.with(SetPolicy).authorize('create')

    const { name, description, itemIds } = await request.validateUsing(storeSetValidator)

    await db.transaction(async (trx) => {
      const set = await Set.create({ name, description }, { client: trx })
      if (itemIds && itemIds.length > 0) {
        await set.related('items').attach(itemIds)
      }
      return set
    })

    session.flash('success', 'Set created successfully')
    return response.redirect().toRoute('listing.set')
  }

  async show({ params, inertia, bouncer }: HttpContext) {
    await bouncer.with(SetPolicy).authorize('view')

    const set = await Set.query()
      .where('id', params.id)
      .preload('items')
      .preload('validations', (query) => {
        query.preload('user')
      })
      .firstOrFail()

    return inertia.render('Admin/Dashboard/Sets/Show', {
      set,
      title: `Show set: ${set.name}`,
      can: {
        update: await bouncer.with(SetPolicy).allows('update'),
        delete: await bouncer.with(SetPolicy).allows('delete'),
        validateInstallation: await bouncer.with(SetPolicy).allows('validateInstallation'),
        validateUninstallation: await bouncer.with(SetPolicy).allows('validateUninstallation'),
        validatePhotography: await bouncer.with(SetPolicy).allows('validatePhotography'),
      },
    })
  }

  async edit({ params, inertia, bouncer }: HttpContext) {
    await bouncer.with(SetPolicy).authorize('update')

    const set = await Set.query()
      .where('id', params.id)
      .preload('items')
      .preload('validations')
      .firstOrFail()
    const allItems = await Item.all()

    return inertia.render('Admin/Dashboard/Sets/Edit', { set, allItems })
  }

  async update({ params, request, response, session, bouncer }: HttpContext) {
    await bouncer.with(SetPolicy).authorize('update')

    const { name, description, itemIds } = await request.validateUsing(updateSetValidator)

    await db.transaction(async (trx) => {
      const set = await Set.findOrFail(params.id, { client: trx })
      set.merge({ name, description })
      await set.save()
      await set.related('items').sync(itemIds ?? [], true)
    })

    session.flash('success', 'Set updated successfully')
    return response.redirect().toRoute('listing.set')
  }

  async destroy({ params, response, session, bouncer }: HttpContext) {
    await bouncer.with(SetPolicy).authorize('delete')

    const set = await Set.findOrFail(params.id)
    await set.delete()

    session.flash('success', 'Set deleted successfully')
    return response.redirect().toRoute('listing.set')
  }
}
