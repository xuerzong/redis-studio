import { isTauri } from '@tauri-apps/api/core'

export const disableContextMenu = () => {
  if (isTauri() && import.meta.env.MODE !== 'development') {
    document.addEventListener('contextmenu', (event) => {
      event.preventDefault()
    })
  }
}
