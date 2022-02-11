import Link from 'next/link';
import styles from './styles.module.scss';

export function SupportButton() {
  return (
    <div className={styles.donateContainer}>
      <Link href="/donate">
        <button>Apoie este Projeto!</button>
      </Link>
    </div>
  )
}