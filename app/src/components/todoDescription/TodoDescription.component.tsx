import styles from './todoDescription.module.scss'

const TodoDescription = () => {
  return (
    <div className={styles.description}>
      <div></div>
      <div></div>
      <h5 className="heading-5">Schüler:in</h5>
      <h5 className="heading-5">fällig</h5>
    </div>
  )
}

export default TodoDescription
