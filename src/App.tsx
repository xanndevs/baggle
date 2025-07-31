import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { airplaneSharp, briefcaseSharp, cartSharp, pricetagSharp, settingsSharp } from 'ionicons/icons';
import Travels from './pages/Travels/Travels';
import Baggages from './pages/Baggages/Baggages';
import StoreItems from './pages/StoreItems';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import Settings from './pages/Settings';
import BaggageDetails from './pages/Baggages/BaggageDetails';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>

          <Route exact path="/travels">
            <Travels />
          </Route>

          <Route exact path="/baggages">
            <Baggages />
          </Route>
          <Route path="/baggages/:uuid" component={BaggageDetails} />

          <Route path="/store-items">
            <StoreItems />
          </Route>

          <Route path="/settings">
            <Settings />
          </Route>

          <Route exact path="/">
            <Redirect to="/travels" />
          </Route>

        </IonRouterOutlet>
        <IonTabBar slot="bottom">

          <IonTabButton tab="travels" href="/travels">
            <IonIcon aria-hidden="true" icon={airplaneSharp} />
            <IonLabel>Travels</IonLabel>
          </IonTabButton>

          <IonTabButton tab="baggages" href="/baggages">
            <IonIcon aria-hidden="true" icon={briefcaseSharp} />
            <IonLabel>Baggages</IonLabel>
          </IonTabButton>

          <IonTabButton tab="store-items" href="/store-items">
            <IonIcon aria-hidden="true" icon={cartSharp} />
            <IonLabel>Store</IonLabel>
          </IonTabButton>

          <IonTabButton tab="settings" href="/settings">
            <IonIcon aria-hidden="true" icon={settingsSharp} />
            <IonLabel>Settings</IonLabel>
          </IonTabButton>

        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
