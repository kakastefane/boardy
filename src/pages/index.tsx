import { useState } from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head'

import firebase from '../services/firebaseConnection';

import styles from '../styles/home.module.scss';


type Data = {
  id: string;
  donate: boolean;
  lastDonate: Date;
  image: string;
}
interface HomeProps {
  data: string;
}

export default function Home({ data }: HomeProps) {
  const [donaters, setDonaters] = useState<Data[]>(JSON.parse(data));

  return (
    <>
      <Head>
        <title>Boardy - Organizando suas tarefas!</title>
      </Head>
      <main className={styles.contentContainer}>
        <img src="/images/board-user.svg" alt="Boardy" />

        <section className={styles.callToAction}>
          <h1>Uma ferramenta para o seu dia a dia. Escreva, planeje e se organize.</h1>
          <p><span>100% gratuita</span> e online.</p>
        </section>

        {donaters.length !== 0 && (
          <div className={styles.donaters}>
            <h3>Apoiadores</h3>
            <ul>
              {donaters.map(donater => (
                <li key={donater.id}><img src={donater.image} alt={donater.id} /></li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {

  const donaters = await firebase.firestore().collection('users').get();
  const data = JSON.stringify(donaters.docs.map(u => {
    return {
      id: u.id,
      ...u.data(),
    }
  }));

  return {
    props: {
      data
    },
    revalidate: 60 * 60 // revalida a cada 60 minutos
  }
}