import type { NextPage } from 'next';
import Image from 'next/image';
import { signIn, signOut, useSession } from 'next-auth/react';
import { trpc } from '../../utils/trpc';
import {
  IonButtons,
  IonMenuButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonIcon
} from '@ionic/react';

import { logoGoogle, logoDiscord, logOutOutline } from 'ionicons/icons';

const Login: NextPage = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <main>Loading...</main>;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>{session?.user ? 'Logout' : 'Login'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen scrollEvents overflow-scroll="false">
        {session ? (
          <div className="m-auto flex h-full flex-col items-center justify-center">
            <Image
              src="/hangharder.png"
              alt="logo"
              width={50}
              height={50}
            ></Image>
            <h1 className="text-xl">Hi {session.user?.name}</h1>
            <button
              className="align-center mt-4 flex flex-row items-center rounded-md border-2 border-gray-500 bg-white px-6 py-3 font-semibold text-gray-900 shadow outline-none hover:border-blue-400 hover:bg-blue-50 focus:outline-none"
              onClick={() => signOut()}
            >
              <span>Logout</span>
              <IonIcon icon={logOutOutline} className="ml-2" />
            </button>
          </div>
        ) : (
          <div className="m-auto flex h-full flex-col items-center justify-center">
            <h1 className="text-xl">Login</h1>
            <div className="m-x-2 flex flex-col">
              <button
                className="mt-4 rounded-md border-2 border-gray-500 bg-white px-6 py-3 font-semibold text-gray-900 shadow outline-none hover:border-blue-400 hover:bg-blue-50 focus:outline-none"
                onClick={() => signIn('discord')}
              >
                <IonIcon icon={logoDiscord} className="mr-2" />
                Login with Discord
              </button>
              <button
                className="mt-4 rounded-md border-2 border-gray-500 bg-white px-6 py-3 font-semibold text-gray-900 shadow outline-none hover:border-blue-400 hover:bg-blue-50 focus:outline-none"
                onClick={() => signIn('google')}
              >
                <IonIcon icon={logoGoogle} className="mr-2" />
                Login with Google
              </button>
            </div>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Login;
