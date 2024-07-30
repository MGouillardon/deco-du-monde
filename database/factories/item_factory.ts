import Factory from '@adonisjs/lucid/factories'
import Item from '#models/item'

export const ItemFactory = Factory.define(Item, ({ faker }) => {
  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    isPhotographedStudio: faker.datatype.boolean(),
  }
}).build()
