import type { NextPage } from 'next';
import Image from 'next/image';
import { signIn, signOut, useSession } from 'next-auth/react';
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
import { useForm } from 'react-hook-form';
import { logoGoogle, logoDiscord, logOutOutline } from 'ionicons/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { string } from 'zod';

const schema = z.object({
  // name: z.string().min(5, { message: 'Must be 5 or more characters long' }),
  email: z
    .string({
      required_error: 'Email is required'
    })
    .email({ message: 'Invalid email address' }),
  password: z.string()
});

type Schema = z.infer<typeof schema>;

const Input = ({
  label,
  type,
  register,
  required
}: {
  label: string;
  type: string;
  register: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  required: boolean;
}) => (
  <div className="flex flex-col">
    <label>{label}</label>
    <input
      className="rounded p-2"
      type={type}
      {...register(label, { required })}
    />
  </div>
);

const LogInForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Schema>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: Schema) => {
    await signIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input label="email" type="email" register={register} required />
        {errors.email && <div>{errors.email.message}</div>}
        <Input label="password" type="password" register={register} required />
        <input
          type={'submit'}
          className="my-2 w-full rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
        />
      </form>
    </>
  );
};

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
              <LogInForm />
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
