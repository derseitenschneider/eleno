import PulseLoader from 'react-spinners/PulseLoader'

const Loader = ({ loading }) => {
  return (
    <div className="container--loader" style={{ transform: 'rotate(-90deg)' }}>
      <PulseLoader
        loading={loading}
        color={'#4794ae'}
        size={20}
        speedMultiplier={0.6}
      />
    </div>
  )
}

export default Loader
