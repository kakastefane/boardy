import Head from 'next/head';

import styles from './styles.module.scss';
import { FiPlus, FiCalendar, FiEdit2, FiTrash, FiClock } from 'react-icons/fi'
import { SupportButton } from '../../components/SupportButton';

export default function Board() {
  return (
    <>
      <Head>
        <title>Minhas Tarefas | Boardy</title>
      </Head>
      <main className={styles.container}>
        <form>
          <input
            type="text"
            placeholder="Digite sua tarefa"
          />
          <button type="submit">
            <FiPlus />
          </button>
        </form>

        <h1>Você tem 2 tarefas</h1>

        <section className={styles.taskList}>
          <article>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Praesentium, perspiciatis.</p>
            <div className={styles.actions}>
              <span className={styles.date}>
                <FiCalendar />
                <time>11 de fevereiro de 2022</time>
              </span>
              <button className={styles.editButton}>
                <FiEdit2 /> Editar
              </button>
              <button className={styles.deleteButton}>
                <FiTrash /> Excluir
              </button>
            </div>
          </article>
        </section>
      </main>

      <section className={styles.vipContainer}>
        <h3>Obrigado por apoiar este projeto.</h3>
        <span><FiClock /> Ultima doação foi à 3 dias.</span>
      </section>

      <SupportButton />
    </>
  )
}