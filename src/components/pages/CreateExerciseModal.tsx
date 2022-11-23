import type { NextPage } from 'next';
import { trpc } from '../../utils/trpc';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon
} from '@ionic/react';
import { close } from 'ionicons/icons';
import { useEffect } from 'react';

interface CreateExerciseProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  mutation: (data: any) => void;
}

type Inputs = {
  title: string;
  summary: string;
  description: string;
};

const CreateExerciseModal: NextPage<CreateExerciseProps> = (props) => {
  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    session?.user?.id &&
      props.mutation.mutate({
        title: data.title,
        summary: data.summary,
        description: data.description,
        authorId: session.user.id
      });
  };

  useEffect(() => {
    if (props.mutation.isSuccess) {
      props.setIsOpen(false);
      reset();
    }
  }, [props.mutation.isSuccess]);

  return (
    <IonModal isOpen={props.isOpen}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton onClick={() => props.setIsOpen(false)}>
              <IonIcon icon={close} />
            </IonButton>
          </IonButtons>
          <IonTitle>Create Exercise</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="h-full w-full space-y-2 p-2">
          <form onSubmit={handleSubmit(onSubmit)} className="h-full w-full">
            <input
              className="mb-2 w-full rounded bg-gray-200 p-2"
              {...register('title', {
                required: 'Title is Required',
                minLength: {
                  value: 5,
                  message: 'Title must be at least 5 characters'
                }
              })}
              placeholder="Max Hangs"
            />
            <p>{errors.title?.message}</p>
            <input
              className="mb-2 w-full rounded bg-gray-200 p-2"
              {...register('summary', {
                required: 'Summary is Required',
                minLength: {
                  value: 10,
                  message: 'Summary must be at least 20 characters'
                },
                maxLength: {
                  value: 100,
                  message: 'Summary must be less than 100 characters'
                }
              })}
              placeholder="Hang for 10 seconds at 90%"
            />
            <p>{errors.summary?.message}</p>
            <textarea
              rows="4"
              className="mb-2 w-full rounded bg-gray-200 p-2"
              {...register('description', {
                required: 'Description is Required',
                minLength: {
                  value: 20,
                  message: 'Description must be at least 20 characters'
                }
              })}
              placeholder="A longer description of the exercise to explain why, how to do it"
            />
            <p>{errors.description?.message}</p>
            <input className="rounded bg-blue-400 p-2" type="submit" />
          </form>

          {props.mutation.error && (
            <p className="text-red">
              Something went wrong! {props.mutation.error.message}
            </p>
          )}
        </div>
      </IonContent>
    </IonModal>
  );
};

export default CreateExerciseModal;
