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
const RenderController = () => import('#controllers/admin/dashboard/render_controller')
const LoginController = () => import('#controllers/auth/login_controller')
router.on('/').renderInertia('home', { version: 6 })

router
  .group(() => {
    router.get('/login', [LoginController, 'render']).as('login')
    router.post('/login', [LoginController, 'login'])
  })
  .prefix('admin')
  .use(middleware.guest())

router
  .group(() => {
    router.get('/dashboard', [RenderController, 'index']).as('dashboard')
  })
  .prefix('admin')
  .use(middleware.auth())
