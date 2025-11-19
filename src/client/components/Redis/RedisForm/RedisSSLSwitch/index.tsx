import { Box } from '@/client/components/ui/Box'
import { Button } from '@/client/components/ui/Button'
import { FileInput } from '@/client/components/ui/FileInput'
import { FormField } from '@/client/components/ui/Form'
import { Modal } from '@/client/components/ui/Modal'
import { Switch } from '@/client/components/ui/Switch'
import { Settings2Icon } from 'lucide-react'
import { useEffect, useState } from 'react'
import s from './index.module.scss'

export const RedisSSLSwitch = () => {
  const [open, setOpen] = useState(false)
  const [checked, setChecked] = useState(false)
  const [SSLConfig, setSSLConfig] = useState({
    ca: '',
    cert: '',
    key: '',
  })
  useEffect(() => {
    console.log({
      tls: checked,
      SSLConfig,
    })
  }, [checked, SSLConfig])
  return (
    <Box>
      <Box
        position="relative"
        display="inline-flex"
        alignItems="center"
        gap="var(--spacing-md)"
      >
        <Switch checked={checked} onCheckedChange={setChecked} />
        {checked && (
          <Button
            className={s.ConfigButton}
            variant="outline"
            onClick={() => setOpen(true)}
          >
            <Settings2Icon />
            Config
          </Button>
        )}
      </Box>

      <Modal
        title="SSL Config"
        open={open}
        onOpenChange={setOpen}
        footer={
          <Box
            padding="1rem"
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
          >
            <Button
              onClick={() => {
                console.log(SSLConfig)
              }}
            >
              Confirm
            </Button>
          </Box>
        }
      >
        <Box
          width="100%"
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap="var(--spacing-md)"
        >
          <FormField name="caCertificate" label="CA Certificate">
            <FileInput
              value={SSLConfig.ca}
              onChange={(e) => {
                setSSLConfig((pre) => ({ ...pre, ca: e }))
              }}
            />
          </FormField>

          <FormField name="clientCert" label="Client Cert">
            <FileInput
              value={SSLConfig.cert}
              onChange={(e) => {
                setSSLConfig((pre) => ({ ...pre, cert: e }))
              }}
            />
          </FormField>

          <FormField name="clientKey" label="Client Key">
            <FileInput
              value={SSLConfig.key}
              onChange={(e) => {
                setSSLConfig((pre) => ({ ...pre, key: e }))
              }}
            />
          </FormField>
        </Box>
      </Modal>
    </Box>
  )
}
