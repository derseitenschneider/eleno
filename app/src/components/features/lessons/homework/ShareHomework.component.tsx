import { Info, XIcon } from 'lucide-react'
import { FaTelegramPlane } from 'react-icons/fa'
import { HiCheck, HiOutlineClipboard, HiOutlineMail } from 'react-icons/hi'
import { IoLogoWhatsapp } from 'react-icons/io5'
import { MdOutlineTextsms } from 'react-icons/md'
import { SiThreema } from 'react-icons/si'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { appConfig } from '@/config'
import useIsMobileDevice from '@/hooks/useIsMobileDevice'
import { useShareHomework } from '@/hooks/useShareHomework'
import { cn } from '@/lib/utils'

interface ShareHomeworkProps {
  lessonId: number
}

function ShareHomework({ lessonId }: ShareHomeworkProps) {
  const isMobile = useIsMobileDevice()
  const {
    currentHolder,
    sharingAuthorized,
    isAuthorizingStudents,
    isAuthorizingGroup,
    handleShareAuthorization,
    url,
    isCopied,
    lessonDate,
    copyToClipboard,
    bodyText,
    subjectText,
  } = useShareHomework(lessonId)

  if (!currentHolder) return null
  return (
    <div className='relative sm:w-[600px]'>
      {false ? (
        <p className='text-base'>
          Diese Funktion ist in der Demoversion leider nicht verfügbar.
        </p>
      ) : (
        <>
          <Collapsible>
            <Label
              htmlFor='authorization'
              className='flex cursor-pointer items-center gap-1 text-base'
            >
              <Checkbox
                id='authorization'
                checked={sharingAuthorized}
                onCheckedChange={handleShareAuthorization}
              />
              Einwilligung zum Teilen bestätigt
              <CollapsibleTrigger>
                <Info className='mb-[2px] text-primary' size={17} />
              </CollapsibleTrigger>
            </Label>
            <CollapsibleContent>
              <div className='mt-3 rounded-md bg-primary/15 px-4 pb-6 pt-8 sm:py-5'>
                <CollapsibleTrigger asChild>
                  <Button
                    className='absolute right-2 top-11 h-4'
                    size='icon'
                    variant='ghost'
                  >
                    <XIcon />
                  </Button>
                </CollapsibleTrigger>
                <p>Mit dem Setzen dieser Checkbox bestätigst du, dass:</p>
                <ul className='list-inside list-disc py-3 leading-5'>
                  <li> diese Schüler:innen volljährig sind, ODER </li>
                  <li>
                    du die ausdrückliche Einwilligung der Erziehungsberechtigten
                    hast, Hausaufgaben über einen Weblink zu teilen.{' '}
                  </li>
                </ul>
                <p>
                  Diese Einstellung ist erforderlich, um die Hausaufgaben-Links
                  zu aktivieren und dient dem Schutz minderjähriger
                  Schüler:innen gemäss{' '}
                  <a
                    href='https://eleno.net/terms-conditions/#sharing-homework'
                    target='_blank'
                    rel='noreferrer'
                    className=''
                  >
                    Allgemeiner Geschäftsbedingungen
                  </a>
                  .
                </p>
              </div>
            </CollapsibleContent>
          </Collapsible>
          {sharingAuthorized && (
            <div
              className={cn(
                (isAuthorizingStudents || isAuthorizingGroup) &&
                  'opacity-50 pointer-events-none',
              )}
            >
              <p className='mt-4'>
                Mit diesem Link kann{' '}
                <b>
                  {currentHolder.type === 's'
                    ? `${currentHolder.holder.firstName} ${currentHolder.holder.lastName}`
                    : currentHolder.holder.name}{' '}
                </b>{' '}
                auf die Hausaufgaben vom <b>{lessonDate}</b> zugreifen:
              </p>
              <div className='mt-2 flex flex-col sm:mb-6 sm:flex-row'>
                <a
                  href={url}
                  className='break-words'
                  target='_blank'
                  rel='noreferrer'
                >
                  {url}
                </a>{' '}
                {isMobile ? (
                  <Button
                    className='mt-4 flex items-center gap-1'
                    variant='outline'
                    onClick={copyToClipboard}
                  >
                    {isCopied ? (
                      <>
                        <HiCheck className='size-4' color='green' />
                        Link kopiert
                      </>
                    ) : (
                      <>
                        <HiOutlineClipboard className='size-5' />
                        Link kopieren
                      </>
                    )}
                  </Button>
                ) : (
                  <button
                    className='ml-2'
                    type='button'
                    title={isCopied ? 'Link kopiert' : 'Link kopieren'}
                    aria-label={isCopied ? 'Link kopiert' : 'Link kopieren'}
                    onClick={copyToClipboard}
                  >
                    {isCopied ? (
                      <HiCheck className='size-4' color='green' />
                    ) : (
                      <HiOutlineClipboard className='size-4' />
                    )}
                  </button>
                )}
              </div>

              <Separator className='my-4 sm:hidden' />
              <div className='flex flex-col gap-3  sm:flex-row sm:justify-between'>
                <p>Link direkt verschicken:</p>
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-2'>
                  <Button
                    asChild
                    variant={isMobile ? 'outline' : 'ghost'}
                    className='flex items-center gap-2 text-[#2aabee]'
                    size={isMobile ? 'sm' : 'icon'}
                  >
                    <a
                      href={`https://t.me/share/url?url=${url}&text=${bodyText}`}
                      title='Link per Telegram verschicken'
                      target='_blank'
                      className='!no-underline'
                      rel='noreferrer'
                    >
                      <FaTelegramPlane className='h-5 w-5' />
                      {isMobile && 'Telegram'}
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant={isMobile ? 'outline' : 'ghost'}
                    size={isMobile ? 'sm' : 'icon'}
                    className='flex items-center gap-2 text-foreground'
                  >
                    <a
                      href={`https://threema.id/compose?text=${bodyText}`}
                      title='Link per Threema verschicken'
                      target='_blank'
                      className='!no-underline'
                      rel='noreferrer'
                    >
                      <SiThreema className='h-5 w-5' />
                      {isMobile && 'Threema'}
                    </a>
                  </Button>

                  <Button
                    asChild
                    variant={isMobile ? 'outline' : 'ghost'}
                    size={isMobile ? 'sm' : 'icon'}
                    className='flex items-center gap-2 text-[#25d366]'
                  >
                    <a
                      href={`https://wa.me/?text=${bodyText}`}
                      title='Link per Whatsapp verschicken'
                      target='_blank'
                      rel='noreferrer'
                      className='!no-underline'
                    >
                      <IoLogoWhatsapp className='h-5 w-5' />
                      {isMobile && 'WhatsApp'}
                    </a>
                  </Button>

                  <Button
                    asChild
                    variant={isMobile ? 'outline' : 'ghost'}
                    size={isMobile ? 'sm' : 'icon'}
                    className='flex items-center gap-2 text-foreground'
                  >
                    <a
                      href={`sms://?&body=${bodyText}`}
                      title='Link per SMS verschicken'
                      className='!no-underline'
                    >
                      <MdOutlineTextsms className='h-5 w-5' />
                      {isMobile && 'SMS'}
                    </a>
                  </Button>

                  <Button
                    asChild
                    variant={isMobile ? 'outline' : 'ghost'}
                    size={isMobile ? 'sm' : 'icon'}
                    className='flex items-center gap-2 text-foreground'
                  >
                    <a
                      href={`mailto:?subject=${subjectText}&body=${bodyText}`}
                      title='Link per E-Mail verschicken'
                      className='!no-underline'
                    >
                      <HiOutlineMail className='h-5 w-5' />
                      {isMobile && 'E-Mail'}
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ShareHomework
