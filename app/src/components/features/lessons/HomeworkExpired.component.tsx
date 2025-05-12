import { Button } from '@/components/ui/button'

export function HomeworkExpired() {
  return (
    <div>
      <p className='mb-4'>
        Aus Datenschutzgründen sind die Links zum Teilen der Hausaufgaben nur
        zwei Wochen nach Erfassen der Lektion gültig.
      </p>
      <p className='mb-4'>
        Du kannst den Link für zwei weitere Wochen reaktivieren.
      </p>
      <div className='ml-auto  flex items-center gap-1'>
        <Button
          // disabled={isDisabledSave}
          size='sm'
          // onClick={handleSave}
          className='ml-auto block'
        >
          Link reaktivieren
        </Button>
        {/* {isCreating && <MiniLoader />} */}
      </div>
    </div>
  )
}
