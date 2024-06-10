import type { SetStateAction } from "react"
import type { NotesBackgrounds } from "../../../types/types"
import { cn } from "@/lib/utils"

type TNoteColorProps = {
  color: NotesBackgrounds
  setColor: React.Dispatch<SetStateAction<NotesBackgrounds>>
}

export default function NoteColor({ color, setColor }: TNoteColorProps) {
  return (
    <div>
      <div className='mb-2'>Farbe auswählen</div>
      <div className='flex gap-2'>
        <button
          className={cn(
            "size-5 border-foreground relative rounded-sm border",
            color === null && "ring",
            "after:absolute after:h-[140%] after:w-px after:bg-foreground after:top-[-20%] after:left-[50%] after:rotate-[45deg] after:origin-center",
          )}
          type='button'
          onClick={() => setColor(null)}
          aria-label='Farbauswahl standard'
          title='Keine Farbe'
        />
        <button
          className={cn(
            "size-5 rounded-sm bg-noteRed",
            color === "red" && "ring",
          )}
          type='button'
          onClick={() => setColor("red")}
          aria-label='Farbauswahl rot'
          title='Rot'
        />
        <button
          className={cn(
            "size-5 bg-noteBlue rounded-sm",
            color === "blue" && "ring",
          )}
          type='button'
          onClick={() => setColor("blue")}
          aria-label='Farbauswahl blue'
          title='Blau'
        />
        <button
          className={cn(
            "size-5 bg-noteGreen rounded-sm",
            color === "green" && "ring",
          )}
          type='button'
          onClick={() => setColor("green")}
          aria-label='Farbauswahl grün'
          title='Grün'
        />
        <button
          className={cn(
            "size-5 bg-noteYellow rounded-sm",
            color === "yellow" && "ring",
          )}
          type='button'
          onClick={() => setColor("yellow")}
          aria-label='Farbauswahl gelb'
          title='Gelb'
        />
      </div>
    </div>
  )
}
