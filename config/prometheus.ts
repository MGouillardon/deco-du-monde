import env from '#start/env'
import { defineConfig } from '@julr/adonisjs-prometheus'
import { httpCollector } from '@julr/adonisjs-prometheus/collectors/http_collector'
import { lucidCollector } from '@julr/adonisjs-prometheus/collectors/lucid_collector'
import { systemCollector } from '@julr/adonisjs-prometheus/collectors/system_collector'

export default defineConfig({
  endpoint: '/metrics',

  metricsPrefix: 'photo_studio',

  ipsWhitelist: env.get('NODE_ENV') === 'development' ? [] : ['127.0.0.1'],

  collectors: [
    httpCollector({
      excludedRoutes: ['/metrics', '/admin/login', '/admin/password/*'],
      shouldGroupStatusCode: true,
    }),
    lucidCollector(),
    systemCollector(),
  ],
})
