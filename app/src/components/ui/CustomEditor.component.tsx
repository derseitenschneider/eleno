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
  Link,
  List,
  ListOrdered,
  Redo,
  RemoveFormatting,
  Strikethrough,
  Underline,
  Undo,
} from 'lucide-react'
import { type ClipboardEvent, type MouseEvent, useState } from 'react'
import { cn } from '@/lib/utils'
import { saniziteHtmlforEditor } from '@/utils/sanitizeHTML'

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
const BtnLink = createButton('Link', <Link />, ({ $selection }) => {
  if ($selection?.nodeName === 'A') {
    document.execCommand('unlink')
  } else {
    const url = prompt('Link', '') || undefined
    if (url) {
      document.execCommand('createLink', false, url)

      // Get the current selection
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)

        // Find the newly created link
        let linkElement: HTMLAnchorElement | null = null

        if (range.startContainer.nodeType === Node.TEXT_NODE) {
          linkElement = range.startContainer.parentElement?.closest('a') || null
        } else if (range.startContainer.nodeType === Node.ELEMENT_NODE) {
          linkElement = (range.startContainer as Element).closest('a')
        }

        if (linkElement) {
          // Set the target attribute to _blank
          linkElement.setAttribute('target', '_blank')
        }
      }
    }
  }
})

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
  const [selectedButtons, setSelectedButtons] = useState<Array<string>>([])
  const [isFocus, setIsFocus] = useState(false)

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
    return (
      <EditorProvider>
        <Editor
          onPaste={handlePaste}
          value={value}
          disabled={disabled}
          onChange={onChangeEditor}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
        >
          <Toolbar
            style={{
              position: 'absolute',
              bottom: 'calc(-100% + 4px)',
              opacity: isFocus ? '1' : '0',
              pointerEvents: isFocus ? 'all' : 'none',
              visibility: isFocus ? 'visible' : 'hidden',
              transition: 'all ease-in 180ms',
            }}
            tabIndex={-1}
            aria-disabled={disabled}
          >
            <div className='flex'>
              <BtnBold title='Fett' tabIndex={-1} className='p-2' />
              <BtnItalic title='Kursiv' tabIndex={-1} />
              <BtnUnderline title='Unterstrich' tabIndex={-1} />
              <BtnStrikeThrough title='Durchgestrichen' tabIndex={-1} />
              <BtnLink title='Link' tabIndex={-1} />
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
            <BtnLink title='Link' tabIndex={-1} />
          </div>
          <div className='flex'>
            <BtnBulletList title='Liste' tabIndex={-1} />
            <BtnNumberedList title='Nummerierte Liste' tabIndex={-1} />
          </div>
          <div className='flex'>
            <BtnClearFormatting title='Formatierung entfernen' tabIndex={-1} />
            <BtnUndo title='Rückgänging' tabIndex={-1} />
            <BtnRedo title='Wiederherstellen' tabIndex={-1} />
          </div>
        </Toolbar>
      </Editor>
    </EditorProvider>
  )
}

export default CustomEditor
