import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import Head from 'next/head';

import styles from './styles.module.scss';

interface DonateProps {
  user: {
    name: string;
    id: string;
    image: string;
  }
}

export default function Donate({ user }: DonateProps) {
  return (
    <>
      <Head>
        <title>Boardy - Organizando suas tarefas!</title>
      </Head>
      <main className={styles.contentContainer}>
        <img src="/images/rocket.svg" alt="Foguete" />
        <div className={styles.vip}>
          <img src={user.image} alt={user.name} />
          <span>Parabéns você é um novo apoiador!</span>
        </div>
        <section className={styles.callToAction}>
          <h1>Seja um apoiador deste projeto 🏆</h1>
          <p>Contribua com apenas <span>R$ 0,99</span></p>
          <strong>Apareça na nossa home e tenha funcionalidades exclusivas.</strong>
        </section>
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if (!session?.id) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  const user = {
    name: session?.user.name,
    id: session?.id,
    image: session?.user.image
  }

  return {
    props: {
      user
    }
  }
}