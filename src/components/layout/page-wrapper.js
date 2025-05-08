import styles from './page-wrapper.module.css';

export default function PageWrapper({ children }) {
  return <main className={styles.wrapper}>{children}</main>;
}