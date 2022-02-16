import { useState, FormEvent } from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';

import styles from './styles.module.scss';
import { FiPlus, FiCalendar, FiEdit2, FiTrash, FiClock } from 'react-icons/fi'
import { SupportButton } from '../../components/SupportButton';

import firebase from '../../services/firebaseConnection';

interface BoardProps {
  user: {
    id: string;
    name: string;
  }
}

export default function Board({ user }: BoardProps) {
  const [input, setInput] = useState('');

  async function handleAddTask(e: FormEvent) {
    e.preventDefault();

    if (input === "") {
      alert('Digite sua tarefa!');
      return;
    }

    await firebase.firestore()
      .collection('tasks')
      .add({
        created: new Date(),
        task: input,
        userId: user.id,
        name: user.name
      })
      .then((doc) => {
        console.log('Cadastro efetuado!', doc);
      })
      .catch((err) => {
        console.log('Erro ao cadastrar!', err);
      })

  }

  return (
    <>
      <Head>
        <title>Minhas Tarefas | Boardy</title>
      </Head>
      <main className={styles.container}>
        <form onSubmit={handleAddTask}>
          <input
            type="text"
            placeholder="Digite sua tarefa"
            value={input}
            onChange={(e) => setInput(e.target.value)}
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

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if (!session?.id) {
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    }
  }

  const user = {
    id: session?.id,
    name: session?.user.name
  }

  return {
    props: {
      user
    }
  }
}