import Factory from '@adonisjs/lucid/factories'
import Set from '#models/set'
import { ItemFactory } from './item_factory.js'

export const SetFactory = Factory.define(Set, ({ faker }) => {
  const themes = [
    'Living Room',
    'Bedroom',
    'Dining Room',
    'Home Office',
    'Kitchen',
    'Bathroom',
    'Outdoor Patio',
    'Kids Room',
    'Study Area',
    'Entertainment Center',
  ]

  const styles = [
    'Modern',
    'Rustic',
    'Minimalist',
    'Scandinavian',
    'Industrial',
    'Bohemian',
    'Coastal',
    'Traditional',
    'Mid-Century',
    'Contemporary',
  ]

  const randomTheme = faker.helpers.arrayElement(themes)
  const randomStyle = faker.helpers.arrayElement(styles)

  return {
    name: `${randomStyle} ${randomTheme} Set`,
    description: `A curated collection of furniture and decor for a ${randomStyle.toLowerCase()} ${randomTheme.toLowerCase()}. This set combines functionality and style to create an inviting and cohesive space.`,
    isPhotographed: faker.datatype.boolean(),
  }
})
  .relation('items', () => ItemFactory)
  .build()
