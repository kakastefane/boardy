import { AppProps } from 'next/app';
import { Provider as NextAuthProvider } from 'next-auth/client';

import { Header } from '../components/Header';

import '../styles/global.scss';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <NextAuthProvider session={session}>
      <Header />
      <Component {...pageProps} />
    </NextAuthProvider>
  )
}

export default MyApp
