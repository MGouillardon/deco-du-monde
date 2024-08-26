/* eslint-disable unicorn/filename-case */
import { ref, readonly } from 'vue'

const message = ref('')
const type = ref('info')
const show = ref(false)
let timer = null

export function useFlashMessage() {
  const setFlashMessage = (newMessage, newType = 'info') => {
    message.value = newMessage
    type.value = newType
    show.value = true

    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      clearFlashMessage()
    }, 2000)
  }

  const clearFlashMessage = () => {
    message.value = ''
    type.value = 'info'
    show.value = false
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  return {
    message: readonly(message),
    type: readonly(type),
    show: readonly(show),
    setFlashMessage,
    clearFlashMessage,
  }
}
