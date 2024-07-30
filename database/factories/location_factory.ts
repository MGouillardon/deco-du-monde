import Factory from '@adonisjs/lucid/factories'
import Location from '#models/location'

export const LocationFactory = Factory.define(Location, ({ faker }) => {
  const isStudio = faker.datatype.boolean()
  return {
    name: isStudio ? `Studio ${faker.company.name()}` : `House ${faker.location.streetAddress()}`,
    address: faker.location.streetAddress(),
    isStudio: isStudio,
  }
}).build()
