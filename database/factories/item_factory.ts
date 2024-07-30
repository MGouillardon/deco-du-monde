import Factory from '@adonisjs/lucid/factories'
import Item from '#models/item'

export const ItemFactory = Factory.define(Item, ({ faker }) => {
  const categories = [
    'Chair',
    'Table',
    'Lamp',
    'Sofa',
    'Bookshelf',
    'Rug',
    'Vase',
    'Painting',
    'Mirror',
    'Clock',
  ]
  const materials = [
    'Wooden',
    'Metal',
    'Glass',
    'Plastic',
    'Leather',
    'Fabric',
    'Ceramic',
    'Marble',
  ]
  const colors = ['Red', 'Blue', 'Green', 'Yellow', 'White', 'Black', 'Brown', 'Gray']

  const randomCategory = faker.helpers.arrayElement(categories)
  const randomMaterial = faker.helpers.arrayElement(materials)
  const randomColor = faker.helpers.arrayElement(colors)

  return {
    name: `${randomColor} ${randomMaterial} ${randomCategory}`,
    description: faker.lorem.sentence(),
    isPhotographedStudio: faker.datatype.boolean(),
  }
}).build()
