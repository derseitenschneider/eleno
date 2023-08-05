import CreateAccountImage from '../../../../assets/images/manual/account/create-account.avif'
import CreateAccountImagePng from '../../../../assets/images/manual/account/create-account.png'
import ConfirmEmailImage from '../../../../assets/images/manual/account/confirm-email.avif'
import ConfirmEmailImagePng from '../../../../assets/images/manual/account/confirm-email.png'

import { IoPersonCircleOutline } from 'react-icons/io5'

import Image from '../../../image/Image.component'
import ManualFooter from '../../../common/manual-footer/ManualFooter.component'
import { useEffect } from 'react'

const CreateAccount = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  })

  return (
    <div className="container">
      <h1 className="heading-1" id="create-account">
        <IoPersonCircleOutline />
        Account einrichten
      </h1>
      <p>
        Das Einrichten eines Accounts folgt ja immer etwa dem gleichen Muster,
        so auch bei Eleno. Du füllst das Anmeldeformular wahrheitsgetreu aus.
      </p>

      <Image
        source={[{ srcset: CreateAccountImage, mediaWidth: '800px' }]}
        fallback={{
          src: CreateAccountImagePng,
          alt: 'Screenshot Eleno Account einrichten',
        }}
      />
      <p>
        Im Anschluss erhälst du eine Email, um deine Email-Adresse zu
        bestätigen.
      </p>
      <Image
        source={[{ srcset: ConfirmEmailImage, mediaWidth: '800px' }]}
        fallback={{
          src: ConfirmEmailImagePng,
          alt: 'Screenshot Eleno Email-Adresse bestätigen',
        }}
      />
      <p>
        Und das war's dann auch schon, es sind keine weiteren Schritte
        notwendig.
      </p>
      <ManualFooter
        linkPrev="/manual"
        textPrev="Willkommen"
        linkNext="/manual/quick-start"
        textNext="Quick-Start"
      />
    </div>
  )
}

export default CreateAccount
