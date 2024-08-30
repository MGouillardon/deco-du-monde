export function formatEventType(type) {
  const types = {
    studio_shoot: 'Studio Shoot',
    set_preparation: 'Set Preparation',
    set_shoot: 'Set Shoot',
    set_removal: 'Set Removal',
  }
  return types[type] || type
}

export function formatRole(role) {
  const roles = {
    photograph: 'Photographer',
    assistant_photograph: 'Assistant Photographer',
    decorator: 'Decorator',
    assistant_decorator: 'Assistant Decorator',
    driver_assistant: 'Driver Assistant',
  }
  return roles[role] || role
}

export function formatDateTime(dateTimeString) {
  const date = new Date(dateTimeString)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC',
  })
}

export const formatWidgetTitle = (key) => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .toLowerCase()
    .replace(/^./, (char) => char.toUpperCase())
}

export const formatWidgetDate = (dateString) => {
  return new Date(dateString).toLocaleString()
}
