import styles from './LoadingSpinner.module.css';

export default function LoadingSpinner({ size = 32, fullPage = false }) {
  if (fullPage) {
    return (
      <div className={styles.fullPage}>
        <div className={styles.spinner} style={{ width: size, height: size }} />
      </div>
    );
  }
  return <div className={styles.spinner} style={{ width: size, height: size }} />;
}
