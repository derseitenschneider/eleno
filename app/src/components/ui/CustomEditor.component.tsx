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

  if (type === 'mini')
    // TODO: Make toolbar appear only on focus without loosing link popover functionality.
    return (
      <EditorProvider>
        <Editor
          onPaste={handlePaste}
          value={value}
          disabled={disabled}
          onChange={onChangeEditor}
        >
          <Toolbar
            style={{
              position: 'absolute',
              bottom: 'calc(-100% + 4px)',
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
        value={value}
        disabled={disabled}
        onChange={onChangeEditor}
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
