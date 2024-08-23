/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const ScheduleController = () => import('#controllers/admin/dashboard/schedule_controller')
const SetController = () => import('#controllers/admin/dashboard/set_controller')
const ItemController = () => import('#controllers/admin/dashboard/item_controller')
const ProfileController = () => import('#controllers/admin/dashboard/profile_controller')
const PasswordResetController = () => import('#controllers/auth/password_reset_controller')
const UsersController = () => import('#controllers/admin/dashboard/users_controller')
const LogoutController = () => import('#controllers/auth/logout_controller')
const RenderController = () => import('#controllers/admin/dashboard/render_controller')
const LoginController = () => import('#controllers/auth/login_controller')

router.on('/').redirect('/admin/dashboard')

router
  .group(() => {
    router.get('/login', [LoginController, 'render']).as('login')
    router.post('/login', [LoginController, 'login'])
  })
  .prefix('admin')
  .use(middleware.guest())

router
  .group(() => {
    router
      .get('/password/reset/:token', [PasswordResetController, 'show'])
      .as('password.reset.form')
    router.post('/password/reset', [PasswordResetController, 'reset']).as('password.reset')
  })
  .prefix('admin')

router
  .group(() => {
    router.get('/dashboard', [RenderController]).as('dashboard')
    router.get('/dashboard/profile/:id', [ProfileController, 'show']).as('profile.show')
    router.put('/dashboard/profile/update/:id', [ProfileController, 'update']).as('profile.update')
    router
      .post('/dashboard/profile/:id/request-password-reset', [
        ProfileController,
        'requestPasswordReset',
      ])
      .as('profile.request_password_reset')
    router.delete('/logout', [LogoutController]).as('logout')
  })
  .prefix('admin')
  .use(middleware.auth())

router
  .group(() => {
    router
      .get('/', ({ response }) => response.redirect('/admin/dashboard/users/listing'))
      .as('users')
    router.get('/listing', [UsersController, 'index']).as('listing.user')
    router.get('/create', [UsersController, 'create']).as('create.user')
    router.post('/store', [UsersController, 'store']).as('store.user')
    router.get('/edit/:id', [UsersController, 'edit']).as('edit.user')
    router.put('/update/:id', [UsersController, 'update']).as('update.user')
    router.delete('/delete/:id', [UsersController, 'destroy']).as('delete.user')
  })
  .prefix('admin/dashboard/users')
  .use(middleware.auth())

router
  .group(() => {
    router
      .get('/', ({ response }) => response.redirect('/admin/dashboard/items/listing'))
      .as('items')
    router.get('/listing', [ItemController, 'index']).as('listing.item')
    router.get('/create', [ItemController, 'create']).as('create.item')
    router.post('/store', [ItemController, 'store']).as('store.item')
    router.get('/show/:id', [ItemController, 'show']).as('show.item')
    router.get('/edit/:id', [ItemController, 'edit']).as('edit.item')
    router.put('/update/:id', [ItemController, 'update']).as('update.item')
    router.delete('/delete/:id', [ItemController, 'destroy']).as('delete.item')
  })
  .prefix('admin/dashboard/items')
  .use(middleware.auth())

router
  .group(() => {
    router.get('/', ({ response }) => response.redirect('/admin/dashboard/sets/listing')).as('sets')
    router.get('/listing', [SetController, 'index']).as('listing.set')
    router.get('/create', [SetController, 'create']).as('create.set')
    router.post('/store', [SetController, 'store']).as('store.set')
    router.get('/show/:id', [SetController, 'show']).as('show.set')
    router.get('/edit/:id', [SetController, 'edit']).as('edit.set')
    router.put('/update/:id', [SetController, 'update']).as('update.set')
    router.delete('/delete/:id', [SetController, 'destroy']).as('delete.set')
  })
  .prefix('admin/dashboard/sets')
  .use(middleware.auth())

router
  .group(() => {
    router
      .get('/', ({ response }) => response.redirect('/admin/dashboard/schedule/index'))
      .as('schedules')
    router.get('/index', [ScheduleController, 'index']).as('index.schedule')
    router.get('/create', [ScheduleController, 'create']).as('create.schedule')
    router.post('/store', [ScheduleController, 'store']).as('store.schedule')
    router.get('/show/:id', [ScheduleController, 'show']).as('show.schedule')
    router.get('/edit/:id', [ScheduleController, 'edit']).as('edit.schedule')
    router.put('/update/:id', [ScheduleController, 'update']).as('update.schedule')
    router.delete('/delete/:id', [ScheduleController, 'destroy']).as('delete.schedule')
  })
  .prefix('admin/dashboard/schedules')
  .use(middleware.auth())

router.get('schedule/fetch-events', [ScheduleController, 'fetchEvents']).as('schedule.fetchEvents')
