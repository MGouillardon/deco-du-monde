/* eslint-disable unicorn/filename-case */
import { ref, watchEffect } from 'vue'

export function useTheme() {
  const theme = ref('cupcake')

  const toggleTheme = () => {
    theme.value = theme.value === 'cupcake' ? 'dracula' : 'cupcake'
  }

  watchEffect(() => {
    document.documentElement.setAttribute('data-theme', theme.value)
  })

  return {
    theme,
    toggleTheme,
  }
}
