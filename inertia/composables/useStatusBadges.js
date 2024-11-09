/* eslint-disable unicorn/filename-case */
export function useStatusBadges() {
  const BADGE_CLASSES = {
    SUCCESS: 'badge badge-success',
    ERROR: 'badge badge-error',
    INFO: 'badge badge-info',
    WARNING: 'badge badge-warning',
  }

  const STATUS_CLASSES = {
    normal: BADGE_CLASSES.INFO,
    damaged: BADGE_CLASSES.WARNING,
    lost: BADGE_CLASSES.ERROR,
  }

  const formatBadge = (condition, trueValue, falseValue) => ({
    value: condition ? trueValue : falseValue,
    class: condition ? BADGE_CLASSES.SUCCESS : BADGE_CLASSES.ERROR,
  })

  return {
    BADGE_CLASSES,
    STATUS_CLASSES,
    formatBadge,
  }
}
