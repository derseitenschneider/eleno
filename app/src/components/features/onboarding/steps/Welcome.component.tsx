import useProfileQuery from '../../user/profileQuery'

export default function Welcome() {
  const { data: profile } = useProfileQuery()
  return (
    <div className='text-base'>
      <h2 className='mb-2'>
        Hallo {profile?.first_name}, willkommen bei Eleno
      </h2>
      <div className='flex flex-col space-y-4'>
        <p>
          Mit Eleno bringst du im Handumdrehen Struktur in deinen
          Musikunterricht. Die ersten Schritte sind ganz einfach, damit du
          schnell startklar bist und deinen administrativen Alltag ganz
          entspannt und professionell im Griff hast.
        </p>
      </div>
    </div>
  )
}
