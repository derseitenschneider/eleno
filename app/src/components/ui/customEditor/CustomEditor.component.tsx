import {
  type ContentEditableEvent,
  Editor,
  EditorProvider,
  Toolbar,
  createButton,
} from "react-simple-wysiwyg"
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
} from "lucide-react"
import { Toggle } from "@/components/ui/toggle"
import { cloneElement } from "react"

interface CustomEditorProps {
  value: string
  onChange: (content: string) => void
}

const BtnBold = createButton(
  "Bold",
  <Toggle aria-label='Toggle bold'>
    <Bold className='h-4' />
  </Toggle>,
  "bold",
)

const BtnItalic = createButton(
  "Italic",
  <Toggle aria-label='Toggle italic'>
    <Italic className='h-4' />
  </Toggle>,
  "italic",
)

const BtnUnderline = createButton(
  "Underline",
  <Toggle aria-label='Toggle underline'>
    <Underline className='h-4' />
  </Toggle>,
  "underline",
)

const BtnStrikeThrough = createButton(
  "Strike Through",
  <Toggle aria-label='Toggle strike-through'>
    <Strikethrough className='h-4' />
  </Toggle>,
  "strikeThrough",
)

const BtnBulletList = createButton(
  "Bullet list",
  <Toggle aria-label='Toggle bullet list'>
    <List className='h-4' />
  </Toggle>,
  "insertUnorderedList",
)

const BtnNumberedList = createButton(
  "Numbered list",
  <Toggle aria-label='Toggle numbered list'>
    <ListOrdered className='h-4' />
  </Toggle>,
  "insertOrderedList",
)

const BtnLink = createButton(
  "Link",
  <Toggle aria-label='Toggle link'>
    <Link className='h-4' />
  </Toggle>,
  "createLink",
)

const BtnClearFormatting = createButton(
  "Clear Formatting",
  <Toggle aria-label='Toggle clear formatting'>
    <RemoveFormatting className='h-4' />
  </Toggle>,
  "RemoveFormatting",
)

const BtnUndo = createButton(
  "Undo",
  <Toggle aria-label='Toggle undo'>
    <Undo className='h-4' />
  </Toggle>,
  "undo",
)

const BtnRedo = createButton(
  "Redo",
  <Toggle aria-label='Toggle redo' className=''>
    <Redo className='h-4' />
  </Toggle>,
  "redo",
)

function CustomEditor({ value, onChange }: CustomEditorProps) {
  const onChangeEditor = (e: ContentEditableEvent) => {
    const inputText = e.target.value
    const inputWithoutColorTag = inputText.split("background-color:").join("")

    onChange(inputWithoutColorTag)
  }
  return (
    <EditorProvider>
      <Editor value={value} onChange={onChangeEditor} className='bg-red-500'>
        <Toolbar className='flex'>
          <div>
            <BtnBold className='p-2' />
            <BtnItalic tabIndex={-1} />
            <BtnUnderline tabIndex={-1} />
            <BtnStrikeThrough tabIndex={-1} />
            <BtnLink tabIndex={-1} />
          </div>
          <div>
            <BtnBulletList tabIndex={-1} />
            <BtnNumberedList tabIndex={-1} />
          </div>
          <div className='container--right'>
            <BtnClearFormatting tabIndex={-1} />
            <BtnUndo tabIndex={-1} />
            <BtnRedo tabIndex={-1} />
          </div>
        </Toolbar>
      </Editor>
    </EditorProvider>
  )
}

export default CustomEditor
