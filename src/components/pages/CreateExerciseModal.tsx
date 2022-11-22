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
}

type Inputs = {
  title: string;
  summary: string;
  description: string;
};

const CreateExerciseModal: NextPage<CreateExerciseProps> = (props) => {
  const { data: session } = useSession();
  const mutation = trpc.exercise.insertOne.useMutation();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    session?.user?.id &&
      mutation.mutate({
        title: data.title,
        summary: data.summary,
        description: data.description,
        authorId: session.user.id
      });
  };

  useEffect(() => {
    if (mutation.isSuccess) {
      props.setIsOpen(false);
    }
  }, [mutation.isSuccess]);

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
        {/* 
          - Create a form with the following fields:
          - Title
          - Description
          - Summary
          - Duration
          - Image
        */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
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
          <input type="submit" />
        </form>

        {mutation.error && (
          <p className="text-red">
            Something went wrong! {mutation.error.message}
          </p>
        )}
      </IonContent>
    </IonModal>
  );
};

export default CreateExerciseModal;
