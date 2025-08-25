import { Link2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { Button, type ButtonProps } from './button'
import { Input } from './input'
import { Label } from './label'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

export const LinkButton = (props?: ButtonProps) => {
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState('')
  const [linkText, setLinkText] = useState('')
  const [selection, setSelection] = useState<Selection | null>(null)
  const [range, setRange] = useState<Range | null>(null)
  const [isLink, setIsLink] = useState(false)
  const [currentLink, setCurrentLink] = useState<HTMLAnchorElement | null>(null)
  const [hasSelection, setHasSelection] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Function to update placeholder visibility
  const updatePlaceholderVisibility = () => {
    if (!buttonRef.current) return

    // Find the closest editor to this button (parent traversal)
    const toolbar = buttonRef.current.closest('.rsw-toolbar')
    if (!toolbar) return

    const editorContainer = toolbar.closest('.rsw-editor')
    if (!editorContainer) return

    const editorContent =
      editorContainer.querySelector('.rsw-ce')?.innerHTML || ''

    if (editorContent && editorContent !== '<br>') {
      // Editor has content, trigger change to update parent component
      const event = new Event('input', { bubbles: true })
      editorContainer.querySelector('.rsw-ce')?.dispatchEvent(event)
    }
  }

  // Save selection when popover opens
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      // Find the correct editor associated with this button
      if (!buttonRef.current) return

      const toolbar = buttonRef.current.closest('.rsw-toolbar')
      if (!toolbar) return

      const editorContainer = toolbar.closest('.rsw-editor')
      if (!editorContainer) return

      const editorElement = editorContainer.querySelector(
        '.rsw-ce',
      ) as HTMLElement
      if (editorElement) {
        editorElement.focus()
      }

      // Now get the selection
      const currentSelection = window.getSelection()
      if (!currentSelection || currentSelection.rangeCount === 0) {
        setOpen(false)
        return
      }

      // Store the current selection
      setSelection(currentSelection)

      // Clone the range to preserve it
      const currentRange = currentSelection.getRangeAt(0).cloneRange()
      setRange(currentRange)

      // Check if we're inside a link
      let linkElement = null
      if (currentRange.startContainer.nodeType === Node.TEXT_NODE) {
        linkElement = currentRange.startContainer.parentElement?.closest('a')
      } else if (currentRange.startContainer.nodeType === Node.ELEMENT_NODE) {
        linkElement = (currentRange.startContainer as Element).closest('a')
      }

      // Check if there's actually text selected
      const isTextSelected = !currentRange.collapsed

      if (linkElement) {
        // Editing an existing link
        setIsLink(true)
        setCurrentLink(linkElement as HTMLAnchorElement)
        setUrl(linkElement.getAttribute('href') || '')
        setLinkText(linkElement.textContent || '')
      } else {
        // Creating a new link
        setIsLink(false)
        setCurrentLink(null)
        setUrl('')

        // If text is selected, prefill the linkText field with the selected text
        if (isTextSelected) {
          setLinkText(currentRange.toString())
        } else {
          setLinkText('')
        }
      }
    }
    setOpen(newOpen)
  }

  // Focus input when popover opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  const applyLink = () => {
    if (!selection || !range) return

    // If URL is empty, don't proceed
    if (!url.trim()) {
      setOpen(false)
      return
    }

    // Restore selection
    selection.removeAllRanges()
    selection.addRange(range)

    if (isLink && currentLink) {
      // Update existing link
      currentLink.setAttribute('href', url)

      // Update link text if provided
      if (linkText.trim()) {
        currentLink.textContent = linkText
      }
    } else {
      // Create new link
      const link = document.createElement('a')
      link.href = url
      link.target = '_blank'
      link.rel = 'noopener noreferrer'

      // Check if range is collapsed (no actual selection)
      const isRangeCollapsed = range.collapsed

      if (isRangeCollapsed) {
        // No text selected, use linkText or URL
        link.textContent = linkText.trim() || url
        range.insertNode(link)
      } else {
        // Text is selected
        if (linkText.trim()) {
          // Use provided link text instead of selection
          link.textContent = linkText
          range.deleteContents()
          range.insertNode(link)
        } else {
          // Use selected text
          const selectedContent = range.extractContents()
          link.appendChild(selectedContent)
          range.insertNode(link)
        }
      }

      // Select the new link
      selection.removeAllRanges()
      const newRange = document.createRange()
      newRange.selectNodeContents(link)
      selection.addRange(newRange)
    }

    // Close popover
    setOpen(false)

    // Check if we need to update placeholder visibility
    setTimeout(updatePlaceholderVisibility, 0)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      applyLink()
    }
  }

  const removeLink = () => {
    if (!currentLink) return

    const fragment = document.createDocumentFragment()
    fragment.appendChild(document.createTextNode(currentLink.textContent || ''))
    currentLink.parentNode?.replaceChild(fragment, currentLink)

    setOpen(false)

    // Check if the editor is now empty after removing the link
    setTimeout(updatePlaceholderVisibility, 0)
  }

  return (
    <Popover modal={true} open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button type='button' className='rsw-btn' {...props} ref={buttonRef}>
          <Link2 size={18} />
        </button>
      </PopoverTrigger>
      <PopoverContent hasPortal={false} className='w-72'>
        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='link-url'>URL</Label>
            <Input
              ref={inputRef}
              id='link-url'
              value={url}
              type='url'
              onChange={(e) => setUrl(e.target.value)}
              placeholder='https://example.com'
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='link-text'>Linktext</Label>
            <Input
              id='link-text'
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              placeholder='Anzuzeigender Text'
              onKeyDown={handleKeyDown}
            />
            <p className='text-xs text-foreground/75'>
              Leer lassen, um die URL als Text zu verwenden.
            </p>
          </div>
          <div className='flex justify-between'>
            {isLink && (
              <Button variant='destructive' size='sm' onClick={removeLink}>
                Link entfernen
              </Button>
            )}
            <div className={cn('ml-auto', !isLink && 'w-full')}>
              <Button size='sm' className='w-full' onClick={applyLink}>
                {isLink ? 'Aktualisieren' : 'Link einfügen'}
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
