import Head from 'next/head'

import styles from '../styles/home.module.scss';

export default function Home() {
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

        <div className={styles.donaters}>
          <h3>Apoiadores</h3>
          <ul>
            <li><img src="https://avatars.githubusercontent.com/u/8293795?s=120&v=4" alt="Kariston" /></li>
          </ul>
        </div>
      </main>
    </>
  )
}
