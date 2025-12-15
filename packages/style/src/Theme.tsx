import React from 'react'

interface ThemeContextState {
  theme: 'dark' | 'light'
}

const ThemeContext = React.createContext<ThemeContextState | null>(null)

export const useThemeContext = () => {
  const context = React.useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used in <ThemeProvider />')
  }
  return context
}

interface ThemeProps {
  theme: 'dark' | 'light'
}

interface ThemeToken {
  colors: {
    background: string
    text: string
    primary: string
    secondary: string
  }
  spacing: {
    small: string
    medium: string
    large: string
  }
  typography: {
    fontFamily: string
    fontSize: string
    fontWeight: string
  }
}

export const Theme: React.FC<React.PropsWithChildren<ThemeProps>> = ({
  children,
}) => {
  return <>{children}</>
}

export default Theme
