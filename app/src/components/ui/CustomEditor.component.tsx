import {
  type ContentEditableEvent,
  Editor,
  EditorProvider,
  Toolbar,
  createButton,
} from 'react-simple-wysiwyg'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Redo,
  RemoveFormatting,
  Strikethrough,
  Underline,
  Undo,
} from 'lucide-react'
import { type ClipboardEvent, useState } from 'react'
import { cn } from '@/lib/utils'
import { saniziteHtmlforEditor } from '@/utils/sanitizeHTML'

import { LinkButton } from './LinkButton.component'
import useIsMobileDevice from '@/hooks/useIsMobileDevice'

// Regular buttons
const BtnBold = createButton('Bold', <Bold />, 'bold')
const BtnItalic = createButton('Italic', <Italic />, 'italic')
const BtnUnderline = createButton('Underline', <Underline />, 'underline')
const BtnStrikeThrough = createButton(
  'Strike Through',
  <Strikethrough />,
  'strikeThrough',
)
const BtnBulletList = createButton(
  'Bullet list',
  <List />,
  'insertUnorderedList',
)
const BtnNumberedList = createButton(
  'Numbered list',
  <ListOrdered />,
  'insertOrderedList',
)
const BtnClearFormatting = createButton(
  'Clear Formatting',
  <RemoveFormatting />,
  'removeFormat',
)
const BtnUndo = createButton('Undo', <Undo />, 'undo')
const BtnRedo = createButton('Redo', <Redo />, 'redo')

type CustomEditorProps = {
  value: string
  onChange: (content: string) => void
  disabled?: boolean
  placeholder?: string
  type?: 'normal' | 'mini'
}

function CustomEditor({
  value,
  onChange,
  disabled,
  placeholder = '',
  type = 'normal',
}: CustomEditorProps) {
  const [showPlaceholder, setShowPlaceholder] = useState(!value)
  const isMobile = useIsMobileDevice()

  const onChangeEditor = (e: ContentEditableEvent) => {
    const inputText = e.target.value
    if (showPlaceholder && inputText) {
      setShowPlaceholder(false)
    }
    if (!showPlaceholder && !inputText) {
      setShowPlaceholder(true)
    }
    onChange(inputText)
  }

  function handlePaste(e: ClipboardEvent) {
    e.preventDefault()
    const pastedText =
      e.clipboardData.getData('text/html') || e.clipboardData.getData('text')
    const cleanedText = saniziteHtmlforEditor(pastedText)
    document.execCommand('insertHTML', false, cleanedText)
  }

  function handleTouchStart(e: React.TouchEvent) {
    // Only handle touch for contentEditable elements and when not disabled
    const target = e.target as HTMLElement
    if (target.isContentEditable && !disabled && isMobile) {
      // Store touch position and time to detect scrolling vs tapping
      const touch = e.touches[0]
      if (touch) {
        ;(target as any)._touchStartY = touch.clientY
        ;(target as any)._touchStartTime = Date.now()
      }
    }
  }

  function handleTouchEnd(e: React.TouchEvent) {
    // Only focus if it was an intentional tap, not a scroll gesture
    const target = e.target as HTMLElement
    if (target.isContentEditable && !disabled && isMobile) {
      const touchEndTime = Date.now()
      const touchDuration = touchEndTime - ((target as any)._touchStartTime || 0)
      const touchStartY = (target as any)._touchStartY || 0
      const touchEndY = e.changedTouches[0]?.clientY || 0
      const deltaY = Math.abs(touchEndY - touchStartY)

      // Only focus if it was a quick tap with minimal movement (not a scroll)
      if (touchDuration < 300 && deltaY < 10) {
        target.focus()
        handleSelectionChange()
      }
    }
  }

  function handleSelectionChange() {
    // iOS selection fix - force iOS to recognize the selection
    if (isMobile && window.getSelection) {
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        // Small delay to let iOS process the selection
        setTimeout(() => {
          if (selection.rangeCount > 0) {
            selection.removeAllRanges()
            selection.addRange(range)
          }
        }, 10)
      }
    }
  }

  if (type === 'mini')
    // TODO: Make toolbar appear only on focus without loosing link popover functionality.
    return (
      <EditorProvider>
        <Editor
          onPaste={handlePaste}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onSelect={handleSelectionChange}
          value={value}
          disabled={disabled}
          onChange={onChangeEditor}
          className={isMobile ? 'mobile-editor' : ''}
        >
          <Toolbar
            style={{
              position: 'absolute',
              bottom: isMobile ? 'calc(-100% + 9px)' : 'calc(-100% + 4px)',
            }}
            tabIndex={-1}
            aria-disabled={disabled}
          >
            <div className='flex'>
              <BtnBold title='Fett' tabIndex={-1} className='p-2' />
              <BtnItalic title='Kursiv' tabIndex={-1} />
              <BtnUnderline title='Unterstrich' tabIndex={-1} />
              <BtnStrikeThrough title='Durchgestrichen' tabIndex={-1} />
              <LinkButton title='Link' tabIndex={-1} />
            </div>
          </Toolbar>
          <span data-type='mini' />
          <span
            className={cn(
              'text-foreground/70 pointer-events-none',
              'absolute bottom-[5px] left-[10px]',
            )}
          >
            {value ? '' : placeholder}
          </span>
        </Editor>
      </EditorProvider>
    )

  return (
    <EditorProvider>
      <Editor
        onPaste={handlePaste}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onSelect={handleSelectionChange}
        value={value}
        disabled={disabled}
        onChange={onChangeEditor}
        className={isMobile ? 'mobile-editor' : ''}
      >
        <Toolbar
          style={{ position: 'relative' }}
          tabIndex={-1}
          aria-disabled={disabled}
        >
          <span
            className={cn(
              'text-foreground/70 pointer-events-none',
              'absolute bottom-[-35px] left-[10px]',
            )}
          >
            {value ? '' : placeholder}
          </span>
          <div className='flex'>
            <BtnBold title='Fett' tabIndex={-1} className='p-2' />
            <BtnItalic title='Kursiv' tabIndex={-1} />
            <BtnUnderline title='Unterstrich' tabIndex={-1} />
            <BtnStrikeThrough title='Durchgestrichen' tabIndex={-1} />
            <LinkButton title='Link' />
          </div>
          <div className='flex'>
            <BtnBulletList title='Liste' tabIndex={-1} />
            <BtnNumberedList title='Nummerierte Liste' tabIndex={-1} />
          </div>
          <div className='flex'>
            <BtnClearFormatting title='Formatierung entfernen' tabIndex={-1} />
            <BtnUndo title='R�ckg�nging' tabIndex={-1} />
            <BtnRedo title='Wiederherstellen' tabIndex={-1} />
          </div>
        </Toolbar>
      </Editor>
    </EditorProvider>
  )
}

export default CustomEditor
