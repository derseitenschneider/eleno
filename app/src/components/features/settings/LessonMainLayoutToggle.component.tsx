import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import useSettingsQuery from './settingsQuery'
import { useUpdateSettings } from './useUpdateSettings'

export function LessonMainLayoutToggle() {
  const { data: settings } = useSettingsQuery()
  const { updateSettings, isUpdating } = useUpdateSettings()

  function handleChange(e: 'regular' | 'reverse') {
    if (!settings) return
    updateSettings({ ...settings, lesson_main_layout: e })
  }

  if (!settings) return null
  return (
    <RadioGroup
      disabled={isUpdating}
      id='lessonMainLayout'
      value={settings.lesson_main_layout}
      onValueChange={handleChange}
      className='space-y-1.5'
    >
      <div
        key='regular'
        className='flex items-baseline space-x-2 lg:items-center'
      >
        <RadioGroupItem value='regular' id='regular' />
        <Label
          htmlFor='regular'
          className='cursor-pointer text-base font-normal'
        >
          Neue Lektion oben (Standard)
        </Label>
      </div>

      <div
        key='reverse'
        className='flex items-baseline space-x-2 lg:items-center'
      >
        <RadioGroupItem value='reverse' id='reverse' />
        <Label
          htmlFor='reverse'
          className='cursor-pointer text-base font-normal'
        >
          Vergangene Lektionen oben
        </Label>
      </div>
    </RadioGroup>
  )
}
