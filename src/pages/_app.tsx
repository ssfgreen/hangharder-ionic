import Head from 'next/head';
import Script from 'next/script';
import { trpc } from '../utils/trpc';
import type { AppType } from 'next/dist/shared/lib/utils';
import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';
import React, { useEffect, useState } from 'react';
// import type { AppRouter } from '../server/trpc/router/_app';

import 'tailwindcss/tailwind.css';
import '@ionic/react/css/core.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import '../styles/globals.css';
import '../styles/variables.css';

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps }
}) => {
  const [theme, setTheme] = useState('');

  useEffect(() => {
    setDefaultTheme();
  }, []);

  const setDefaultTheme = () => {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      setTheme('light');
    }
  };

  // console.log(theme, 'theme');

  return (
    <SessionProvider session={session}>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        ></meta>
      </Head>
      <Component {...pageProps} theme={theme} />
      <Script src="https://unpkg.com/ionicons@5.2.3/dist/ionicons.js"></Script>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
