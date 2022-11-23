import {
  IonPage,
  IonHeader,
  IonItem,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonToggle,
  IonLabel
} from '@ionic/react';

import Store from '../../store';
import { StatusBar, Style } from '@capacitor/status-bar';
import * as selectors from '../../store/selectors';
import { setSettings } from '../../store/actions';
import React, { useEffect } from 'react';

const Settings = () => {
  const settings = Store.useState(selectors.getSettings);

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
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleChangeTheme = (theme: string) => {
    console.log('changing theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  };

  const setStatusBarStyle = async (darkMode: boolean) => {
    try {
      await StatusBar.setStyle({
        style: darkMode ? Style.Dark : Style.Light
      });
    } catch {
      handleChangeTheme(darkMode ? 'dark' : 'light');
    }
  };

  return (
    <IonPage className="bg-white dark:bg-black">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="bg-white dark:bg-black">
        <IonList>
          <IonItem>
            <IonLabel>Enable Notifications</IonLabel>
            <IonToggle
              checked={settings.enableNotifications}
              onIonChange={(e) => {
                setSettings({
                  ...settings,
                  enableNotifications: e.target.checked
                });
              }}
            />
          </IonItem>
          <IonItem>
            <IonLabel>Dark Mode</IonLabel>
            <IonToggle
              checked={settings.darkMode}
              onIonChange={(e) => {
                setStatusBarStyle(e.target.checked);
                setSettings({
                  ...settings,
                  darkMode: e.target.checked
                });
              }}
            />
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
