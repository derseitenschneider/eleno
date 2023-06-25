import './customEditor.style.scss'

import { FunctionComponent } from 'react'

import {
  Editor,
  EditorProvider,
  BtnBold,
  BtnItalic,
  Toolbar,
  BtnBulletList,
  BtnNumberedList,
  BtnClearFormatting,
  BtnLink,
  BtnUnderline,
  BtnUndo,
  BtnRedo,
  BtnStrikeThrough,
} from 'react-simple-wysiwyg'

interface CustomEditorProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

const CustomEditor: FunctionComponent<CustomEditorProps> = ({
  value,
  onChange,
}) => {
  return (
    <EditorProvider>
      <Editor value={value} onChange={onChange}>
        <Toolbar>
          <div className="container--left">
            <BtnBold />
            <BtnItalic />
            <BtnUnderline />
            <BtnStrikeThrough />
            <BtnBulletList />
            <BtnNumberedList />
          </div>
          <div className="container--right">
            <BtnClearFormatting />
            <BtnUndo />
            <BtnRedo />
          </div>
        </Toolbar>
      </Editor>
    </EditorProvider>
  )
}

export default CustomEditor
