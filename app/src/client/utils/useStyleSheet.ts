import { useCallback, useEffect, useId } from 'react'
import { kebabCase } from 'string-ts'

declare global {
  interface Window {
    __STYLE_SHEETS__: Map<string, string | number>
  }
}

if (window.__STYLE_SHEETS__ === undefined) {
  window.__STYLE_SHEETS__ = new Map()
}

const hashCode = (message: string, length = 4) => {
  let hash = 0
  const messageLength = message.length

  if (messageLength === 0) {
    return '0'.repeat(length)
  }

  for (let i = 0; i < messageLength; i++) {
    const char = message.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0
  }
  const unsignedHash = hash >>> 0
  let hex = unsignedHash.toString(16)
  hex = hex.padStart(length, '0')
  return hex.slice(0, length)
}

export const generateStyleClassName = (key: string, value: string | number) => {
  return `_${hashCode(key, 2)}${hashCode(value?.toString?.() || '')}`
}

export const useStyleSheet = () => {
  const styleElementId = useId()

  useEffect(() => {
    return () => {
      const styleElement = document.getElementById(
        styleElementId
      ) as HTMLStyleElement | null
      if (styleElement) {
        document.head.removeChild(styleElement)
      }
    }
  }, [])

  return useCallback(
    (props: { [key: string]: any }) => {
      const nextStyle = Object.entries(props)
        .map(([key, value]) => {
          const styleKey = generateStyleClassName(kebabCase(key), value)
          if (!window.__STYLE_SHEETS__.has(styleKey)) {
            window.__STYLE_SHEETS__.set(styleKey, value)
            return `.${styleKey} { ${kebabCase(key)}: ${value}; }`
          }
          return ''
        })
        .filter(Boolean)
        .join('')
      if (nextStyle) {
        const styleElement = document.createElement('style')
        styleElement.setAttribute('data-id', styleElementId)
        document.head.appendChild(styleElement)
        styleElement.innerHTML = nextStyle
      }
    },
    [styleElementId]
  )
}
