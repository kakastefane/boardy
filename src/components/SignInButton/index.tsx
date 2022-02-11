import styles from './styles.module.scss';
import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';

export function SignInButton() {

  const session = true;

  return session ? (
    <button
      type="button"
      className={styles.signInButton}
      onClick={() => { }}
    >
      <img src="https://avatars.githubusercontent.com/u/8293795?s=120&v=4" alt="Kariston Stefane" /> Olá Kariston <FiX />
    </button>
  ) : (
    <button
      type="button"
      className={styles.signInButton}
      onClick={() => { }}
    >
      <FaGithub /> Entrar com Github
    </button>
  )
}