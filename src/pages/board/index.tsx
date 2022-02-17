import { useState, FormEvent } from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import { format, formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import styles from './styles.module.scss';
import { FiPlus, FiCalendar, FiEdit2, FiTrash, FiClock, FiX } from 'react-icons/fi'
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
    vip: boolean;
    lastDonate: string | Date;
  }
  data: string;
}

export default function Board({ user, data }: BoardProps) {
  const [input, setInput] = useState('');
  const [taskList, setTaskList] = useState<TaskList[]>(JSON.parse(data));
  const [taskEdit, setTaskEdit] = useState<TaskList | null>(null);

  async function handleAddTask(e: FormEvent) {
    e.preventDefault();

    if (input === "") {
      alert('Digite sua tarefa!');
      return;
    }

    if (taskEdit) {
      await firebase.firestore()
        .collection('tasks')
        .doc(taskEdit.id)
        .update({
          task: input
        })
        .then(() => {
          let data = taskList;
          let taskIndex = taskList.findIndex(item => item.id === taskEdit.id);
          data[taskIndex].task = input;
          setTaskList(data);
          setTaskEdit(null);
          setInput('');
        })
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

  function handleEditTask(task: TaskList) {
    setTaskEdit(task);
    setInput(task.task);
  }

  function handleCancelEdit() {
    setInput('');
    setTaskEdit(null);
  }

  return (
    <>
      <Head>
        <title>Minhas Tarefas | Boardy</title>
      </Head>
      <main className={styles.container}>
        {taskEdit && (
          <span className={styles.editWarning}>
            <button onClick={handleCancelEdit}>
              <FiX />
            </button>
            Você está editando uma tarefa:
          </span>
        )}
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
                {user.vip && (
                  <button onClick={() => handleEditTask(task)} className={styles.editButton}>
                    <FiEdit2 /> Editar
                  </button>
                )}
                <button onClick={() => handleDelete(task.id)} className={styles.deleteButton}>
                  <FiTrash /> Excluir
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>

      {user.vip && (
        <section className={styles.vipContainer}>
          <h3>Obrigado por apoiar este projeto.</h3>
          <span><FiClock /> Ultima doação foi à {formatDistance(new Date(user.lastDonate), new Date(), { locale: ptBR })}.</span>
        </section>
      )}

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
    name: session?.user.name,
    vip: session?.vip,
    lastDonate: session?.lastDonate,
  }

  return {
    props: {
      user,
      data
    }
  }
}