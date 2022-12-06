import React, { useState } from 'react';
import { trpc } from '@/utils/trpc';
import { IonIcon } from '@ionic/react';
import { starOutline, star } from 'ionicons/icons';

const Favorite = ({
  exerciseId,
  favourited
}: {
  exerciseId: string;
  favourited: boolean;
}) => {
  const utils = trpc.useContext();
  const favouriteMutation = trpc.exercise.favourite.useMutation({
    onMutate: async (exerciseId) => {
      // stop any outgoing refetches (so they don't overwrite our optimistic update)
      utils.exercise.getById.cancel(exerciseId);

      // get snapshot of current value
      const snapshotOfPreviousExercise =
        utils.exercise.getById.getData(exerciseId);

      // modify cache to reflect optimistic update
      utils.exercise.getById.setData(exerciseId, {
        ...snapshotOfPreviousExercise,
        favourite: !snapshotOfPreviousExercise?.favourited
      });

      // return snapshot of previous value incase of failure
      return { snapshotOfPreviousExercise };
    },
    onSuccess: () => {
      utils.exercise.getById.invalidate();
      // utils.exercise.getById.setData(data);
    },
    onError: (err, exerciseId, { snapshotOfPreviousExercise }) => {
      utils.exercise.getById.setData(exerciseId, snapshotOfPreviousExercise);
    }
  });

  const handleFavourite = async () => {
    favouriteMutation.mutate(exerciseId);
  };

  return (
    <button
      className="flex h-16 flex-col items-center justify-center rounded-md border p-2"
      onClick={handleFavourite}
    >
      {favourited ? <IonIcon icon={star} /> : <IonIcon icon={starOutline} />}
      Favorite
    </button>
  );
};

export default Favorite;
