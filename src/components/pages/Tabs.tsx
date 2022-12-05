import { Redirect, Route } from 'react-router-dom';
import {
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel
} from '@ionic/react';
import { person, flash, list, home } from 'ionicons/icons';

import Exercise from './Exercise';
import Exercises from './Exercises';
import Profile from './Profile';
import Logbook from './Logbook';
import Feed from './Feed';
import Login from './Login';
import Settings from './Settings';

const Tabs = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path="/tabs/login" component={Login} exact={true} />
        <Route path="/tabs/exercises" component={Exercises} exact={true} />
        <Route path="/tabs/profile" component={Profile} exact={true} />
        <Route path="/tabs/logbook" component={Logbook} exact={true} />
        <Route path="/tabs/feed" component={Feed} exact={true} />
        <Route
          path="/tabs/exercises/:exerciseId"
          component={Exercise}
          exact={true}
        />
        <Route path="/tabs/settings" component={Settings} exact={true} />
        <Route
          path="/tabs"
          render={() => <Redirect to="/tabs/feed" />}
          exact={true}
        />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="tab1" href="/tabs/feed">
          <IonIcon icon={home} />
          <IonLabel>Home</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab2" href="/tabs/exercises">
          <IonIcon icon={flash} />
          <IonLabel>Exercises</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab3" href="/tabs/logbook">
          <IonIcon icon={list} />
          <IonLabel>Logbook</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab4" href="/tabs/profile">
          <IonIcon icon={person} />
          <IonLabel>Profile</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Tabs;
