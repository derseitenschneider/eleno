import './noteColor.style.scss'
import { SetStateAction } from 'react'
import { TNotesBackgrounds } from '../../../../types/types'

type TNoteColorProps = {
  color: TNotesBackgrounds
  setColor: React.Dispatch<SetStateAction<TNotesBackgrounds>>
}

export default function NoteColor({ color, setColor }: TNoteColorProps) {
  return (
    <div className="note-color">
      <div className="note-color__heading">Farbe auswählen</div>
      <div className="note-color__buttons">
        <button
          className={`button-color button-color--default ${
            color === null ? ' active' : ''
          }`}
          type="button"
          onClick={() => setColor(null)}
          aria-label="Farbauswahl standard"
          title="Keine Farbe"
        />
        <button
          className={`button-color button-color--red ${
            color === 'red' ? ' active' : ''
          }`}
          type="button"
          onClick={() => setColor('red')}
          aria-label="Farbauswahl rot"
          title="Rot"
        />
        <button
          className={`button-color button-color--blue ${
            color === 'blue' ? 'active' : ''
          }`}
          type="button"
          onClick={() => setColor('blue')}
          aria-label="Farbauswahl blue"
          title="Blau"
        />
        <button
          className={`button-color button-color--green ${
            color === 'green' ? 'active' : ''
          }`}
          type="button"
          onClick={() => setColor('green')}
          aria-label="Farbauswahl grün"
          title="Grün"
        />
        <button
          className={`button-color button-color--yellow ${
            color === 'yellow' ? 'active' : ''
          }`}
          type="button"
          onClick={() => setColor('yellow')}
          aria-label="Farbauswahl gelb"
          title="Gelb"
        />
      </div>
    </div>
  )
}
