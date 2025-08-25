import type { User } from '@supabase/supabase-js'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useInitials } from '@/hooks/useInitials'

export function UserInfo({
  user,
  showEmail = false,
}: {
  user: User
  showEmail?: boolean
}) {
  const getInitials = useInitials()
  const { user_metadata: userMeta } = user
  const userFullName = `${userMeta.firstName} ${userMeta.lastName}`

  return (
    <>
      <Avatar className='size-8 overflow-hidden rounded-full'>
        <AvatarImage src={userMeta.picture} alt={userFullName} />
        <AvatarFallback className='rounded-lg bg-background200 text-foreground dark:bg-foreground/70 '>
          {getInitials(userFullName)}
        </AvatarFallback>
      </Avatar>
      <div className='grid flex-1 text-left text-sm leading-tight'>
        <span className='truncate font-medium'>{userFullName}</span>
        {showEmail && (
          <span className='truncate text-xs text-muted-foreground'>
            {user.email}
          </span>
        )}
      </div>
    </>
  )
}
