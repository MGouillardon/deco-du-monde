/* eslint-disable unicorn/filename-case */
import { ref } from 'vue'

export function useFlashMessage() {
  const flashMessage = ref({ type: '', message: '' })
  const showFlash = ref(false)
  let flashTimeout

  const setFlashMessage = (type, message) => {
    flashMessage.value = { type, message }
    showFlash.value = true

    if (flashTimeout) clearTimeout(flashTimeout)
    flashTimeout = setTimeout(() => {
      showFlash.value = false
      flashMessage.value = { type: '', message: '' }
    }, 2000)
  }

  const clearFlashMessage = () => {
    if (flashTimeout) {
      clearTimeout(flashTimeout)
      flashTimeout = null
    }
    showFlash.value = false
    flashMessage.value = { type: '', message: '' }
  }

  return {
    flashMessage,
    showFlash,
    setFlashMessage,
    clearFlashMessage,
  }
}
