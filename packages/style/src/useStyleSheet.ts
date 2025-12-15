import { useCallback, useEffect, useId } from 'react'
import { kebabCase } from 'string-ts'
import hash from '@emotion/hash'

declare global {
  interface Window {
    __STYLE_SHEETS__: Map<string, string | number>
  }
}

if (window.__STYLE_SHEETS__ === undefined) {
  window.__STYLE_SHEETS__ = new Map()
}

export const generateStyleClassName = (
  key: string,
  value: string | number = ''
) => {
  return `${key
    .split('-')
    .map((char) => char[0])
    .join('')}-${hash(`${value}`)}`
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
