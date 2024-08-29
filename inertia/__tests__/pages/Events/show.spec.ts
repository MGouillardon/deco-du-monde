import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Show from '@/pages/Admin/Dashboard/Events/Show.vue'
import { Link } from '@inertiajs/vue3'
import { formatEventType, formatRole, formatDateTime } from '@/utils/formatters'

// Mock the formatters
vi.mock('@/utils/formatters', () => ({
  formatEventType: vi.fn((type) => `Formatted ${type}`),
  formatRole: vi.fn((role) => `Formatted ${role}`),
  formatDateTime: vi.fn((date) => `Formatted ${date}`),
}))

// Mock Inertia Link component
vi.mock('@inertiajs/vue3', () => ({
  Link: {
    name: 'Link',
    props: ['href', 'method', 'as', 'data', 'preserveScroll'],
    template:
      '<component :is="$props.as || \'a\'" :href="href" :data-method="method" v-bind="$props.data"><slot></slot></component>',
  },
}))

describe('Show Event Page', () => {
  const mockEvent = {
    id: 1,
    type: 'studio_shoot',
    location: 'Studio A',
    start: '2023-05-01T09:00:00',
    end: '2023-05-01T17:00:00',
    set: { name: 'Set 1' },
    item: { name: 'Item 1' },
    assignments: [
      { id: 1, user: { fullName: 'John Doe', role: 'photographer' } },
      { id: 2, user: { fullName: 'Jane Smith', role: 'assistant' } },
    ],
  }

  const createWrapper = (props = {}) => {
    return mount(Show, {
      props: {
        event: mockEvent,
        ...props,
      },
      global: {
        components: { Link },
      },
    })
  }

  it('renders event details correctly', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Formatted studio_shoot')
    expect(wrapper.text()).toContain('Studio A')
    expect(wrapper.text()).toContain('Formatted 2023-05-01T09:00:00')
    expect(wrapper.text()).toContain('Formatted 2023-05-01T17:00:00')
    expect(wrapper.text()).toContain('Set 1')
    expect(wrapper.text()).toContain('Item 1')
  })

  it('renders assigned users correctly', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('John Doe')
    expect(wrapper.text()).toContain('Formatted photographer')
    expect(wrapper.text()).toContain('Jane Smith')
    expect(wrapper.text()).toContain('Formatted assistant')
  })

  it('renders edit and delete buttons', () => {
    const wrapper = createWrapper()
    const editButton = wrapper.find('a[href="/admin/dashboard/events/edit/1"]')
    expect(editButton.exists()).toBe(true)
    expect(editButton.text()).toBe('Edit Event')

    const deleteButton = wrapper.find('button[data-id="1"]')
    expect(deleteButton.exists()).toBe(true)
    expect(deleteButton.text()).toBe('Delete Event')
  })

  it('renders back to calendar button', () => {
    const wrapper = createWrapper()
    const backButton = wrapper.find('a[href="/admin/dashboard/events"]')
    expect(backButton.exists()).toBe(true)
    expect(backButton.text()).toBe('Back to Calendar')
  })

  it('handles events without set or item', () => {
    const eventWithoutSetOrItem = { ...mockEvent, set: null, item: null }
    const wrapper = createWrapper({ event: eventWithoutSetOrItem })
    expect(wrapper.text()).not.toContain('Set:')
    expect(wrapper.text()).not.toContain('Item:')
  })

  it('calls formatters with correct arguments', () => {
    createWrapper()
    expect(formatEventType).toHaveBeenCalledWith('studio_shoot')
    expect(formatDateTime).toHaveBeenCalledWith('2023-05-01T09:00:00')
    expect(formatDateTime).toHaveBeenCalledWith('2023-05-01T17:00:00')
    expect(formatRole).toHaveBeenCalledWith('photographer')
    expect(formatRole).toHaveBeenCalledWith('assistant')
  })
})
