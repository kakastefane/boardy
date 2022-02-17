import { AppProps } from 'next/app';
import { Provider as NextAuthProvider } from 'next-auth/client';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

import { Header } from '../components/Header';

import '../styles/global.scss';

const initialOptions = {
  "client-id": "AYTk5aNUlfnFoKSeOeWlvMXRapaNU0QLnpRRqhjLx1qOwvP0SigrA4ibxI7uv3HT8nIvxRarUyLXClKB",
  currency: "BRL",
  intent: 'capture'
}

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <NextAuthProvider session={session}>
      <PayPalScriptProvider options={initialOptions}>
        <Header />
        <Component {...pageProps} />
      </PayPalScriptProvider>
    </NextAuthProvider>
  )
}

export default MyApp
