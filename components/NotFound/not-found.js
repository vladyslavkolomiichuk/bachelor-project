import styles from './not-found.module.css'

export default function MyNotFound() {
  return <div className={styles.container}>
    <h1 className={styles.title}>404</h1>
    <p className={styles.message}>Oooops... page not found!</p>
  </div>
}