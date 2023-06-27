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
  BtnUnderline,
  BtnUndo,
  BtnRedo,
  BtnStrikeThrough,
} from 'react-simple-wysiwyg'

interface CustomEditorProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onFocus?: (action: 'pause' | 'unpause') => void
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
            <BtnBold tabIndex={-1} />
            <BtnItalic tabIndex={-1} />
            <BtnUnderline tabIndex={-1} />
            <BtnStrikeThrough tabIndex={-1} />
            <BtnBulletList tabIndex={-1} />
            <BtnNumberedList tabIndex={-1} />
          </div>
          <div className="container--right">
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
