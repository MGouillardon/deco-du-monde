import { defineConfig } from '@adonisjs/inertia'
import type { InferSharedProps } from '@adonisjs/inertia/types'
import Roles from '#enums/roles'

const inertiaConfig = defineConfig({
  /**
   * Path to the Edge view that will be used as the root view for Inertia responses
   */
  rootView: 'inertia_layout',

  /**
   * Data that should be shared with all rendered pages
   */
  sharedData: {
    auth: (ctx) => {
      const user = ctx.auth?.user
      if (!user) return null

      return {
        ...user,
        can: {
          viewDashboard: [Roles.ADMIN, Roles.PHOTOGRAPH, Roles.DECORATOR].includes(user.roleId),
          viewUsers: user.roleId === Roles.ADMIN,
          viewWork: [Roles.ADMIN, Roles.PHOTOGRAPH, Roles.DECORATOR].includes(user.roleId),
          viewReports: [Roles.ADMIN, Roles.PHOTOGRAPH, Roles.DECORATOR].includes(user.roleId),
        },
      }
    },
    errors: (ctx) => ctx.session?.flashMessages.get('errors'),
    success: (ctx) => ctx.session?.flashMessages.get('success'),
    info: (ctx) => ctx.session?.flashMessages.get('info'),
  },

  /**
   * Options for the server-side rendering
   */
  ssr: {
    enabled: false,
    entrypoint: 'inertia/app/ssr.ts',
  },
})

export default inertiaConfig

declare module '@adonisjs/inertia/types' {
  export interface SharedProps extends InferSharedProps<typeof inertiaConfig> {}
}
