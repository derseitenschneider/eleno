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

interface CustomEditorProps {
  value: string
  onChange: (content: string) => void
}

const BtnBold = createButton("Bold", <Bold />, "bold")

const BtnItalic = createButton("Italic", <Italic />, "italic")

const BtnUnderline = createButton("Underline", <Underline />, "underline")

const BtnStrikeThrough = createButton(
  "Strike Through",
  <Strikethrough />,
  "strikeThrough",
)

const BtnBulletList = createButton(
  "Bullet list",
  <List />,
  "insertUnorderedList",
)

const BtnNumberedList = createButton(
  "Numbered list",
  <ListOrdered />,
  "insertOrderedList",
)

const BtnLink = createButton("Link", <Link />, ({ $selection }) => {
  if ($selection?.nodeName === "A") {
    document.execCommand("unlink")
  } else {
    document.execCommand("createLink", false, prompt("URL", "") || undefined)
  }
})

const BtnClearFormatting = createButton(
  "Clear Formatting",
  <RemoveFormatting />,
  "removeFormat",
)

const BtnUndo = createButton("Undo", <Undo />, "undo")

const BtnRedo = createButton("Redo", <Redo />, "redo")

function CustomEditor({ value, onChange }: CustomEditorProps) {
  const onChangeEditor = (e: ContentEditableEvent) => {
    const inputText = e.target.value
    const inputWithoutColorTag = inputText.split("background-color:").join("")

    onChange(inputWithoutColorTag)
  }
  return (
    <EditorProvider>
      <Editor value={value} onChange={onChangeEditor}>
        <Toolbar className=''>
          <div className='flex'>
            <BtnBold className='p-2' />
            <BtnItalic tabIndex={-1} />
            <BtnUnderline tabIndex={-1} />
            <BtnStrikeThrough tabIndex={-1} />
            <BtnLink tabIndex={-1} />
          </div>
          <div className='flex'>
            <BtnBulletList tabIndex={-1} />
            <BtnNumberedList tabIndex={-1} />
          </div>
          <div className='flex'>
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
