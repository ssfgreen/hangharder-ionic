import React from 'react';
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
      await utils.exercise.getById.cancel(exerciseId);

      // get snapshot of current value
      const origExercise = utils.exercise.getById.getData(exerciseId);

      // modify cache to reflect optimistic update
      if (origExercise) {
        utils.exercise.getById.setData(
          {
            ...origExercise,
            favourited: !origExercise?.favourited
          },
          exerciseId
        );
      }
    },
    onSuccess: () => {
      utils.exercise.getById.invalidate();
    },
    onError: (err, exerciseId) => {
      utils.exercise.getById.refetch(exerciseId);
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
