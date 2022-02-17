import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import { PayPalButtons } from '@paypal/react-paypal-js';
import Head from 'next/head';
import Image from 'next/image';

import firebase from '../../services/firebaseConnection';

import styles from './styles.module.scss';
import rocket from '../../../public/images/rocket.svg';

interface DonateProps {
  user: {
    name: string;
    id: string;
    image: string;
  }
}

export default function Donate({ user }: DonateProps) {
  const [vip, setVip] = useState(false);

  async function handleSaveDonation() {
    await firebase.firestore().collection('users')
      .doc(user.id)
      .set({
        donate: true,
        lastDonate: new Date(),
        image: user.image,
      })
      .then(() => {
        setVip(true);
      })
  }

  return (
    <>
      <Head>
        <title>Boardy - Organizando suas tarefas!</title>
      </Head>
      <main className={styles.contentContainer}>
        <Image src={rocket} alt="Foguete" />

        {vip && (
          <div className={styles.vip}>
            <img src={user.image} alt={user.name} />
            <span>Parabéns você é um novo apoiador!</span>
          </div>
        )}

        <section className={styles.callToAction}>
          <h1>Seja um apoiador deste projeto 🏆</h1>
          <p>Contribua com apenas <span>R$ 0,99</span></p>
          <strong>Apareça na nossa home e tenha funcionalidades exclusivas.</strong>
        </section>
        <PayPalButtons
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: '0.99'
                }
              }]
            })
          }}
          onApprove={(data, actions) => {
            return actions.order.capture().then(function (details) {
              console.log('Compra aprovada: ', details.payer.name.given_name);
              handleSaveDonation();
            })
          }}
        />
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