import type { NextPage } from 'next';
import { Controller, useForm } from 'react-hook-form';
import type { SubmitHandler, FieldValues } from 'react-hook-form';
import Select from 'react-select';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import React from 'react';

interface CreateExerciseProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  mutation: {
    mutate: (data: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
    error: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    isSuccess: boolean;
  };
}

const schema = z.object({
  title: z
    .string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be a string'
    })
    .min(5, { message: 'Must be 5 or more characters long' }),
  summary: z
    .string()
    .min(5, { message: 'Must be 5 or more characters long' })
    .max(20, { message: 'Must be less than 20 characters long' }),
  description: z
    .string()
    .min(15, { message: 'Must be 15 or more characters long' }),
  type: z.enum(['CLIMBER', 'TIMER'])
});

type Schema = z.infer<typeof schema>;

const CreateExerciseModal: NextPage<CreateExerciseProps> = (props) => {
  const { data: session } = useSession();
  const { isOpen, setIsOpen, mutation } = props;
  const workoutDefault = { value: 'TIMER', label: 'Timer' };
  const workoutTypes = [
    { value: 'TIMER', label: 'Timer' },
    { value: 'CLIMBER', label: 'Climb Recorder' }
  ];
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm<Schema>({
    resolver: zodResolver(schema)
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    session?.user?.id &&
      props.mutation.mutate({
        title: data.title,
        summary: data.summary,
        description: data.description,
        authorId: session.user.id,
        type: data.type
      });
  };

  useEffect(() => {
    if (mutation.isSuccess) {
      setIsOpen(false);
      reset();
    }
  }, [mutation.isSuccess, reset, setIsOpen]);

  return (
    <IonModal isOpen={isOpen}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton onClick={() => setIsOpen(false)}>
              <IonIcon icon={close} />
            </IonButton>
          </IonButtons>
          <IonTitle>Create Exercise</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="h-full w-full space-y-2 p-2">
          <form onSubmit={handleSubmit(onSubmit)} className="h-full w-full">
            <label>Title</label>
            <input
              className="mb-2 w-full rounded bg-gray-200 p-2"
              {...register('title')}
              placeholder="Max Hangs"
            />
            {errors && <p>{errors.title?.message}</p>}
            <label>Summary</label>
            <input
              className="mb-2 w-full rounded bg-gray-200 p-2"
              {...register('summary')}
              placeholder="Hang for 10 seconds at 90%"
            />
            <p>{errors.summary?.message}</p>
            <label>Description</label>
            <textarea
              rows={4}
              className="mb-2 w-full rounded bg-gray-200 p-2"
              {...register('description')}
              placeholder="A longer description of the exercise to explain why, how to do it"
            />
            <p>{errors.description?.message}</p>
            <section>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select
                    isClearable
                    {...field}
                    value={workoutTypes.find((c) => c.value === field.value)}
                    onChange={(val) => field.onChange(val?.value)}
                    options={workoutTypes}
                  />
                )}
                rules={{ required: true }}
              />
              {errors && <p>{errors.type?.message}</p>}
            </section>
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
