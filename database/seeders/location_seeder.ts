import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { LocationFactory } from '#factories/location_factory'

export default class LocationSeeder extends BaseSeeder {
  async run() {
    await LocationFactory.merge({ isStudio: true }).createMany(1)
    await LocationFactory.merge({ isStudio: false }).createMany(5)
  }
}
