import MoonLoader from 'react-spinners/MoonLoader'
import AnimatedLogo from '../logo/AnimatedLogo.component'

const Loader = ({ loading }) => {
  return (
    <div className="container--loader">
      <MoonLoader
        loading={loading}
        color={'#4794ae'}
        size={64}
        speedMultiplier={0.6}
      />
    </div>
  )
}

export default Loader
