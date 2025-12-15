import { useEffect, useRef, useState } from 'react'
import { CheckIcon, FilesIcon, PencilIcon, XIcon } from 'lucide-react'
import { useSyncState } from '@client/hooks/useSyncState'
import { Box } from '@rds/style'
import { IconButton } from '@client/components/ui/Button'
import { Editor } from '../Editor'
import { CopyButton } from '../CopyButton'
import s from './index.module.scss'

interface EditableContentProps {
  value?: string
}

export const EditableContent: React.FC<EditableContentProps> = ({ value }) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useSyncState(value || '')
  const [hasHovered, setHasHovered] = useState(false)

  const onDoubleClick = () => {
    setIsEditing(true)
  }

  useEffect(() => {
    if (isEditing && contentRef.current) {
      contentRef.current.focus()
    }
  }, [isEditing])

  return (
    <Box
      position="relative"
      onMouseEnter={() => {
        setHasHovered(true)
      }}
      onMouseLeave={() => {
        setHasHovered(false)
      }}
    >
      {isEditing ? (
        <Editor
          theme={{
            size: '1.5rem',
            fontSize: '0.75rem',
          }}
          value={content}
          onChange={setContent}
        />
      ) : (
        <Box className={s.EditableContent} onDoubleClick={onDoubleClick}>
          {content}
        </Box>
      )}

      {hasHovered && !isEditing && (
        <Box
          position="absolute"
          display="flex"
          alignItems="center"
          top="50%"
          right={0}
          transform="translateY(-50%)"
        >
          <IconButton
            theme={{ size: '1.5rem' }}
            variant="ghost"
            onClick={(e) => {
              e.preventDefault()
              onDoubleClick()
            }}
          >
            <PencilIcon />
          </IconButton>

          <CopyButton theme={{ size: '1.5rem' }} variant="ghost" text={content}>
            <FilesIcon />
          </CopyButton>
        </Box>
      )}

      {isEditing && (
        <Box
          position="absolute"
          display="flex"
          alignItems="center"
          top={0}
          right={0}
          onClick={(e) => {
            e.preventDefault()
          }}
          onMouseDown={(e) => {
            e.preventDefault()
          }}
          gap="var(--spacing-sm)"
        >
          <IconButton
            colorPalette="red"
            theme={{ size: '1.5rem' }}
            variant="ghost"
            onClick={() => {
              setIsEditing(false)
            }}
          >
            <XIcon />
          </IconButton>
          <IconButton
            colorPalette="green"
            theme={{ size: '1.5rem' }}
            variant="ghost"
            onMouseDown={(e) => {
              e.preventDefault()
            }}
            onClick={() => {
              console.log('save', content)
            }}
          >
            <CheckIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  )
}
