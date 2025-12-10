import { useEffect, useRef, useState } from 'react'
import { Box } from '../ui/Box'
import { useSyncState } from '@/client/hooks/useSyncState'
import s from './index.module.scss'
import { IconButton } from '../ui/Button'
import { CheckIcon, XIcon } from 'lucide-react'

interface EditableContentProps {
  value?: string
}

export const EditableContent: React.FC<EditableContentProps> = ({ value }) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useSyncState(value || '')

  const onDoubleClick = () => {
    setIsEditing(true)
  }

  useEffect(() => {
    if (isEditing && contentRef.current) {
      contentRef.current.focus()
    }
  }, [isEditing])

  return (
    <Box position="relative">
      <Box
        className={s.EditableContent}
        ref={contentRef}
        contentEditable={isEditing}
        onBlur={(e) => {
          console.log(e)
          setIsEditing(false)
          setContent((e.target as HTMLDivElement).textContent || '')
        }}
        onDoubleClick={onDoubleClick}
        style={{
          padding: '10px',
          minHeight: '20px',
          cursor: isEditing ? 'text' : 'pointer',
        }}
        data-focused={isEditing}
        dangerouslySetInnerHTML={{ __html: content || '' }}
        onInput={(e) => {
          console.log((e.target as HTMLDivElement).textContent)
        }}
      />

      {isEditing && (
        <Box
          position="absolute"
          display="flex"
          alignItems="center"
          top={0}
          right={0}
          transform="translateY(calc(-100% - var(--spacing-sm)))"
          onClick={(e) => {
            e.preventDefault()
          }}
          onMouseDown={(e) => {
            // 阻止失焦行为
            e.preventDefault()
          }}
          gap="var(--spacing-sm)"
        >
          <IconButton
            theme={{ size: '1.5rem' }}
            variant="outline"
            onClick={(e) => {}}
          >
            <XIcon />
          </IconButton>
          <IconButton
            theme={{ size: '1.5rem' }}
            variant="outline"
            onMouseDown={(e) => {
              e.preventDefault()
            }}
            onClick={(e) => {
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
