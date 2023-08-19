import DashboardImage from '../../../../assets/images/manual/dashboard/dashboard.avif'
import DashboardImagePng from '../../../../assets/images/manual/dashboard/dashboard.png'
import ManualFooter from '../../../common/manual-footer/ManualFooter.component'

import Image from '../../../image/Image.component'

const Welcome = () => {
  return (
    <div className="container">
      <h1 className="heading-1">Anleitung</h1>
      <p>
        Herzlich willkommen bei Eleno. Schön, dass du dich entschieden hast,
        smart zu unterrichten. Ziel von Eleno ist es, die administrative Seite
        des instrumentalen Unterrichts zu erleichtern. Du wirst dadurch
        natürlich nicht automatisch eine bessere Geigenlehrerin oder ein
        besserer Schlagzeuglehrer. Aber du kannst dich während des Unterrichtens
        vollumfänglich auf die Hauptsache konzentrieren - deinen Schüler:innen
        ablenkungsfrei den bestmöglichen Unterricht zu gewährleisten.
      </p>

      <Image
        source={[{ srcset: DashboardImage, mediaWidth: '800px' }]}
        fallback={{
          src: DashboardImagePng,
          alt: 'Screenshot Eleno Dashboard',
        }}
      />
      <ManualFooter linkNext="create-account" textNext="Account einrichten" />
    </div>
  )
}

export default Welcome
