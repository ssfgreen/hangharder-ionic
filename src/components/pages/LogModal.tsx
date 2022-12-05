import type { NextPage } from 'next';
import { trpc } from '@/utils/trpc';
import { Dayjs } from 'dayjs';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Slider from '@mui/material/Slider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Controller,
  useForm,
  FormProvider,
  useFormContext
} from 'react-hook-form';
import { useState } from 'react';
import type { SubmitHandler, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { date } from 'zod';

interface LogProps {
  id: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const schema = z.object({
  dateLogged: z.date(),
  completePerc: z.number().optional(),
  weight: z.number().optional(),
  comment: z.string().optional()
});

type Schema = z.infer<typeof schema>;

const LogModal: NextPage<LogProps> = (props) => {
  const mutation = trpc.log.insertOne.useMutation();

  const methods = useForm<Schema>({
    resolver: zodResolver(schema)
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    console.log('data', data);
    const mutationObj = {
      exerciseId: props.id,
      dateLogged: data.dateLogged,
      ...data
    };

    mutation.mutate(mutationObj);
  };

  return (
    <IonModal isOpen={props.isOpen}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton onClick={() => props.setIsOpen(false)}>
              <IonIcon icon={close} />
            </IonButton>
          </IonButtons>
          <IonTitle>Log</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="my-4 mx-auto h-full w-3/4"
          >
            <NestedInput />
            <input className="rounded bg-blue-400 p-2" type="submit" />
          </form>
        </FormProvider>
      </IonContent>
    </IonModal>
  );
};

const NestedInput = () => {
  const {
    register,
    control,
    formState: { errors }
  } = useFormContext<Schema>();

  console.log('errors', errors);

  const [reqDate, setreqDate] = useState(new Date());

  return (
    <div>
      <section className="my-2 flex flex-col">
        <label>Date</label>
        <Controller
          name="dateLogged"
          defaultValue={reqDate}
          control={control}
          // render={({ field: { onChange, ...rest } }) => (
          render={({ field: { ref, onBlur, name, ...field }, fieldState }) => (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                {...field}
                inputRef={ref}
                onChange={(event) => {
                  !!event && field.onChange(new Date(event));
                  !!event && setreqDate(event);
                }}
                // label="Date"/
                inputFormat="DD/MM/YYYY"
                renderInput={(inputProps) => (
                  <TextField
                    {...inputProps}
                    onBlur={onBlur}
                    name={name}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </LocalizationProvider>
          )}
        />
      </section>
      <section className="my-2 flex flex-col">
        <label>Comment</label>
        <Controller
          render={({ field }) => <TextField {...field} />}
          name="comment"
          control={control}
        />
      </section>
      <section className="my-2">
        <label>Weight Added / Removed</label>
        <input
          type="number"
          className="w-full rounded border-[0.4px] border-black/70 bg-transparent p-2"
          {...register('weight', { valueAsNumber: true })}
        />
      </section>
      <section className="my-2">
        <label>Percent Completed</label>
        <Controller
          name="completePerc"
          control={control}
          defaultValue={100}
          render={({ field }) => (
            <Slider
              {...field}
              onChange={(_, value) => {
                field.onChange(value);
              }}
              max={100}
              step={10}
            />
          )}
        />
      </section>
    </div>
  );
};

export default LogModal;
