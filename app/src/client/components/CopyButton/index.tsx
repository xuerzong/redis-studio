import { FilesIcon, CheckIcon } from 'lucide-react'
import { useState } from 'react'
import { IconButton, type ButtonProps } from '@client/components/ui/Button'
import copy from 'copy-to-clipboard'
import { toast } from 'sonner'

interface CopyButtonProps extends Omit<ButtonProps, 'onClick'> {
  text?: string
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  text = '',
  ...restProps
}) => {
  const [hasCopied, setHasCopied] = useState(false)

  const onCopy = () => {
    copy(text)
    toast.success('Copy Success')
    setHasCopied(true)
    setTimeout(() => {
      setHasCopied(false)
    }, 2000)
  }

  return (
    <IconButton
      onClick={onCopy}
      {...restProps}
      {...(hasCopied && {
        colorPalette: 'success',
      })}
    >
      {hasCopied ? <CheckIcon /> : <FilesIcon />}
    </IconButton>
  )
}
