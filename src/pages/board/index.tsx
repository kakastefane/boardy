import { useState, FormEvent } from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import { format } from 'date-fns';

import styles from './styles.module.scss';
import { FiPlus, FiCalendar, FiEdit2, FiTrash, FiClock } from 'react-icons/fi'
import { SupportButton } from '../../components/SupportButton';

import firebase from '../../services/firebaseConnection';
import Link from 'next/link';

type TaskList = {
  id: string;
  created: string | Date;
  createdFormated?: string;
  task: string;
  userId: string;
  name: string;
}

interface BoardProps {
  user: {
    id: string;
    name: string;
  }
  data: string;
}

export default function Board({ user, data }: BoardProps) {
  const [input, setInput] = useState('');
  const [taskList, setTaskList] = useState<TaskList[]>(JSON.parse(data));

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
        console.log('Cadastro efetuado!');
        let data = {
          id: doc.id,
          created: new Date(),
          createdFormated: format(new Date(), 'dd MMMM yyyy'),
          task: input,
          userId: user.id,
          name: user.name
        }
        setTaskList([...taskList, data]);
        setInput('');
      })
      .catch((err) => {
        console.log('Erro ao cadastrar!', err);
      })

  }

  async function handleDelete(id: string) {
    await firebase.firestore()
      .collection('tasks')
      .doc(id)
      .delete()
      .then(() => {
        console.log('Tarefa excluida com sucesso!');
        let taskDeleted = taskList.filter(item => {
          return (item.id !== id)
        });
        setTaskList(taskDeleted);
      })
      .catch((err) => {
        console.log('Ops, deu erro:', err);
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

        <h1>Você tem {taskList.length} {taskList.length === 1 ? 'tarefa' : 'tarefas'}</h1>

        <section className={styles.taskList}>
          {taskList.map(task => (
            <article key={task.id}>
              <Link href={`/board/${task.id}`}>
                <p>{task.task}</p>
              </Link>
              <div className={styles.actions}>
                <span className={styles.date}>
                  <FiCalendar />
                  <time>{task.createdFormated}</time>
                </span>
                <button className={styles.editButton}>
                  <FiEdit2 /> Editar
                </button>
                <button onClick={() => handleDelete(task.id)} className={styles.deleteButton}>
                  <FiTrash /> Excluir
                </button>
              </div>
            </article>
          ))}
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

  const tasks = await firebase.firestore()
    .collection('tasks')
    .where('userId', '==', session?.id)
    .orderBy('created', "asc")
    .get();
  const data = JSON.stringify(tasks.docs.map(u => {
    return {
      id: u.id,
      createdFormated: format(u.data().created.toDate(), 'dd MMMM yyyy'),
      ...u.data(),
    }
  }))

  const user = {
    id: session?.id,
    name: session?.user.name
  }

  return {
    props: {
      user,
      data
    }
  }
}