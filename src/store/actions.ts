import Store from '.';

export const setSettings = (settings: {
  enableNotifications: boolean;
  darkMode: boolean;
}) => {
  Store.update((s) => {
    s.settings = settings;
  });
};
