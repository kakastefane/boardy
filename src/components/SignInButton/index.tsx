import { signIn, signOut, useSession } from 'next-auth/react';

import styles from './styles.module.scss';
import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';


export function SignInButton() {

  const { data: session } = useSession();

  return session ? (
    <button
      type="button"
      className={styles.signInButton}
      onClick={() => signOut()}
    >
      <img src={session.user.image} alt="Kariston Stefane" /> Olá {session.user.name} <FiX />
    </button>
  ) : (
    <button
      type="button"
      className={styles.signInButton}
      onClick={() => signIn('github')}
    >
      <FaGithub /> Entrar com Github
    </button>
  )
}