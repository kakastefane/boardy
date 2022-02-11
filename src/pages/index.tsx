import Head from 'next/head'

import styles from '../styles/home.module.scss';

export default function Home() {
  return (
    <>
      <Head>
        <title>Boardy</title>
      </Head>

      <main>
        <h1 className={styles.title}>Index</h1>
      </main>
    </>
  )
}
