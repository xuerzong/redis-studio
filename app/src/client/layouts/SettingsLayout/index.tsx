import { Outlet } from 'react-router'
import { Box } from '@rds/style'

export const SettingsLayout: React.FC = () => {
  return (
    <Box display="flex" height="100%">
      <Box flex={1}>
        <Outlet />
      </Box>
    </Box>
  )
}
