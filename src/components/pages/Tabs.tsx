import { Redirect, Route } from 'react-router-dom';
import {
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel
} from '@ionic/react';
import { cog, flash, list } from 'ionicons/icons';

import Exercise from './Exercise';
import Exercises from './Exercises';
import Profile from './Profile';
import Logbook from './Logbook';
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
        <IonTabButton tab="tab1" href="/tabs/exercises">
          <IonIcon icon={flash} />
          <IonLabel>Exercises</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab2" href="/tabs/logbook">
          <IonIcon icon={list} />
          <IonLabel>Logbook</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab3" href="/tabs/settings" className="text-primary">
          <IonIcon icon={cog} />
          <IonLabel>Settings</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Tabs;
