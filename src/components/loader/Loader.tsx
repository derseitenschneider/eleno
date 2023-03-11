import Dotloader from 'react-spinners/DotLoader'

const Loader = ({ loading }) => {
  return (
    <div className="container--loader">
      <Dotloader loading={loading} color={'#4794ae'} />
    </div>
  )
}

export default Loader
