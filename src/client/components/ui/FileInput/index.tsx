import { useRef, useState } from 'react'
import { Box } from '../Box'
import { Button, IconButton } from '../Button'
import { Input } from '../Input'
import './index.scss'
import { XIcon } from 'lucide-react'

interface FileInputPorps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
}

export const FileInput: React.FC<FileInputPorps> = ({
  value,
  onChange,
  placeholder = 'Please Upload File',
}) => {
  const [file, setFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <Box className="FileInput">
      <Input
        ref={inputRef}
        hidden
        type="file"
        onChange={(e) => {
          const [file] = e.target.files || []
          if (file) {
            setFile(file)
            onChange?.(file.name)
          }
        }}
      />
      <Button
        data-placeholder={Boolean(placeholder && !file)}
        variant="outline"
        className="FileInputButton"
        onClick={() => inputRef.current?.click()}
      >
        {file?.name || placeholder}
      </Button>
      {file && (
        <IconButton
          className="FileInputCloseIcon"
          variant="ghost"
          onClick={() => {
            setFile(null)
            onChange?.('')
            if (inputRef.current) {
              inputRef.current.value = ''
            }
          }}
        >
          <XIcon />
        </IconButton>
      )}
    </Box>
  )
}
