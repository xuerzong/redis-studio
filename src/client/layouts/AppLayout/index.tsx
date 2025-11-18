import { Outlet, useNavigate } from 'react-router'
import { PlusIcon, RotateCwIcon, TrashIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { useRedisId } from '@/client/hooks/useRedisId'
import { Box } from '@/client/components/ui/Box'
import { RedisIcon } from '@/client/components/Icons/RedisIcon'
import { IconButton } from '@/client/components/ui/Button'
import { queryConnections, useAppStore } from '@/client/stores/appStore'
import { RedisDeleteModal } from '@/client/components/Redis/RedisDeleteModal'
import s from './index.module.scss'

export const AppLayout = () => {
  const connections = useAppStore((state) => state.connections)
  const navigate = useNavigate()
  const redisId = useRedisId()
  const [delRedisId, setDelRedisId] = useState('')

  useEffect(() => {
    queryConnections()
  }, [])

  return (
    <main className={s.Layout}>
      <PanelGroup direction="horizontal">
        <Panel defaultSize={20} minSize={20} className={s.Sider}>
          <Box
            style={
              {
                '--border-radius': 0,
              } as any
            }
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
            borderBottom="1px solid var(--border-color)"
          >
            <IconButton
              onClick={() => {
                navigate('/create')
              }}
              variant="ghost"
            >
              <PlusIcon />
            </IconButton>

            <IconButton onClick={queryConnections} variant="ghost">
              <RotateCwIcon />
            </IconButton>
          </Box>
          {(connections || []).map((d) => (
            <Box
              className={s.Instance}
              key={d.id}
              onClick={() => {
                navigate(`/${d.id}`)
              }}
              data-active={redisId === d.id}
            >
              <RedisIcon className={s.InstanceIcon} />
              {`${d.host}@${d.port}`}

              <Box className={s.InstanceActions}>
                <IconButton
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    setDelRedisId(d.id)
                  }}
                >
                  <TrashIcon />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Panel>
        <PanelResizeHandle />
        <Panel defaultSize={80} minSize={50} className={s.Content}>
          <Outlet />
        </Panel>
      </PanelGroup>

      <RedisDeleteModal
        open={Boolean(delRedisId)}
        onOpenChange={(open) => {
          if (!open) {
            setDelRedisId('')
          }
        }}
        redisId={delRedisId}
      />
    </main>
  )
}
