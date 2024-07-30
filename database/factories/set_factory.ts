import Factory from '@adonisjs/lucid/factories'
import Set from '#models/set'
import { ItemFactory } from './item_factory.js'

export const SetFactory = Factory.define(Set, ({ faker }) => {
  return {
    name: faker.lorem.words(3),
    description: faker.lorem.sentence(),
    isPhotographed: faker.datatype.boolean(),
  }
})
  .relation('items', () => ItemFactory)
  .build()
