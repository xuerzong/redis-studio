import { Outlet, useLocation, useNavigate } from 'react-router'
import { DatabaseIcon, SettingsIcon } from 'lucide-react'
import { Box } from '@client/components/ui/Box'
import { IconButton } from '@/client/components/ui/Button'
import { GithubIcon } from '@/client/components/Icons/GithubIcon'
import { Tooltip } from '@/client/components/ui/Tooltip'
import { useIntlContext } from '@/client/providers/IntlProvider'
import s from './index.module.scss'
import { useMemo } from 'react'

export const RootLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const pathname = useMemo(() => {
    if (location.pathname.startsWith('/settings')) {
      return location.pathname
    }
    return '/'
  }, [location])
  const { formatMessage } = useIntlContext()
  return (
    <Box className={s.RootLayout} display="flex" height="100vh">
      <Box
        display="flex"
        flexDirection="column"
        flexShrink={0}
        width="calc(var(--sider-size) + 1px)"
        height="100%"
        borderRight="1px solid var(--border-color)"
        className={s.RootMenu}
      >
        <IconButton
          variant={pathname === '/' ? 'subtle' : 'ghost'}
          onClick={() => {
            navigate('/')
          }}
          data-active={pathname === '/'}
        >
          <DatabaseIcon />
        </IconButton>
        <Box flex={1} />
        <Tooltip content={formatMessage('settings')} placement="right">
          <IconButton
            variant={pathname === '/settings' ? 'subtle' : 'ghost'}
            onClick={() => {
              navigate('/settings')
            }}
            className={s.RootMenuButton}
            data-active={pathname === '/settings'}
          >
            <SettingsIcon />
          </IconButton>
        </Tooltip>

        <IconButton
          variant="ghost"
          onClick={() => {
            window.open('https://github.com/xuerzong/redis-studio', '_blank')
          }}
        >
          <GithubIcon />
        </IconButton>
      </Box>
      <Box width="calc(100vw - var(--sider-size) - 1px)" height="100%">
        <Outlet />
      </Box>
    </Box>
  )
}
