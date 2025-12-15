import { useDisplayTheme } from '@client/providers/ConfigProvider'
import { getRedisTypeColor } from '@client/constants/redisColors'
import { Box } from '@rds/style'
import { useMemo } from 'react'

interface RedisTypeTagProps {
  type: string
}

export const RedisTypeTag: React.FC<RedisTypeTagProps> = ({ type }) => {
  const displayTheme = useDisplayTheme()
  const boxTheme = useMemo(() => {
    if (displayTheme === 'dark') {
      return {
        color: 'rgba(var(--color-palette-500) / 1)',
        bgColor: 'rgba(var(--color-palette-950) / 1)',
      }
    }
    return {
      color: 'rgba(var(--color-palette-950) / 1)',
      bgColor: 'rgba(var(--color-palette-100) / 1)',
    }
  }, [displayTheme])
  return (
    <Box
      display="inline-block"
      fontSize="0.75rem"
      color="var(--color)"
      backgroundColor="var(--bg-color)"
      colorPalette={getRedisTypeColor(type)}
      borderRadius="var(--border-radius)"
      padding="0.125rem 0.25rem"
      theme={boxTheme}
    >
      {type}
    </Box>
  )
}
