export const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'normal':
      return 'badge-success'
    case 'damaged':
      return 'badge-warning'
    case 'lost':
      return 'badge-error'
    default:
      return 'badge-ghost'
  }
}
