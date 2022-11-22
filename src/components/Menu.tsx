import { StatusBar, Style } from '@capacitor/status-bar';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { cog, flash, list, logInOutline, logOutOutline } from 'ionicons/icons';

const Menu = () => {
  const { data: session } = useSession();
  const [isDark, setIsDark] = useState(false);

  const pages = [
    {
      title: 'Exercises',
      icon: flash,
      url: '/tabs/exercises'
    },
    {
      title: 'Logbook',
      icon: list,
      url: '/tabs/logbook'
    },
    {
      title: 'Settings',
      icon: cog,
      url: '/tabs/settings'
    },
    {
      title: session?.user ? 'Logout' : 'Login',
      icon: session?.user ? logOutOutline : logInOutline,
      url: '/tabs/login'
    }
  ];

  const handleOpen = async () => {
    try {
      await StatusBar.setStyle({
        style: isDark ? Style.Dark : Style.Light
      });
    } catch {}
  };
  const handleClose = async () => {
    try {
      await StatusBar.setStyle({
        style: isDark ? Style.Dark : Style.Light
      });
    } catch {}
  };

  useEffect(() => {
    setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
  }, []);

  return (
    <IonMenu
      side="start"
      contentId="main"
      // disabled={true}
      onIonDidOpen={handleOpen}
      onIonDidClose={handleClose}
    >
      <IonHeader>
        <IonToolbar>
          <IonTitle>Menu</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {pages.map((p, k) => (
            <IonMenuToggle autoHide={false} key={k}>
              <IonItem
                routerLink={p.url}
                routerDirection="none"
                detail={false}
                lines="none"
              >
                <IonIcon icon={p.icon} slot="start" />
                <IonLabel>{p.title}</IonLabel>
              </IonItem>
            </IonMenuToggle>
          ))}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
