import {
  IonApp,
  IonBadge,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { airplaneOutline, bagOutline, briefcaseOutline, settingsOutline } from 'ionicons/icons';
import React, { useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import Baggages from './pages/Baggages/Baggages';
import StoreItems from './pages/StoreItems';
import Travels from './pages/Travels/Travels';

import './App.css';
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/display.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';

/* Theme variables */
import { useTranslation } from 'react-i18next';
import BaggageDetails from './pages/Baggages/BaggageDetails';
import Settings from './pages/Settings/Settings';
import TravelDetails from './pages/Travels/details/TravelDetails';
import './theme/variables.css';
import { get, subscribe } from './utils/storage';
import ItemImageViewer from './pages/Baggages/ItemImageViewer';



setupIonicReact({
  mode: 'ios',
});

const App: React.FC = () => {
  const [travelData, setTravelData] = React.useState<Travel[]>([]);
  const [baggageData, setBaggageData] = React.useState<Bag[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    let isMounted = true;
    
    const setup = async () => {
      const travels = await get<Travel[]>("travels");
      const baggages = await get<Bag[]>("baggages");
      if (isMounted) {
        if (travels) setTravelData(travels);
        if (baggages) setBaggageData(baggages);
      }
    };

    setup();

    const unsub_travels = subscribe<Travel[]>('travels', (travels) => {
      if (isMounted) {
        //console.log("Travel data updated:", travels);

        setTravelData(travels);
      }
    });


    const unsub_baggages = subscribe<Bag[]>('baggages', (baggages) => {
      if (isMounted) {
        //console.log("Baggage data updated:", baggages);

        setBaggageData(baggages);
      }
    });



    return () => {
      isMounted = false;
      unsub_travels();
      unsub_baggages();
    };
  }, []);


  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs >
          <IonRouterOutlet>

            <Route exact path="/travels">
              <Travels travels={travelData} />
            </Route>
            <Route path="/travels/:uuid" component={TravelDetails} />

            <Route exact path="/baggages">
              <Baggages
              />
            </Route>
            <Route path="/baggages/:uuid" component={BaggageDetails} />

            <Route path="/store-items">
              <StoreItems />
            </Route>

            <Route path="/settings">
              <Settings />
            </Route>

            
            <Route path="/image/:uuid" component={ItemImageViewer} />
            
            <Route exact path="/">
              <Redirect to="/travels" />
            </Route>



          </IonRouterOutlet>
          <IonTabBar slot="bottom" className='floating-tabs glow-border'>

            <IonTabButton tab="travels" href="/travels">
              <IonIcon aria-hidden="true" icon={airplaneOutline} />
              <IonLabel>{ t("tabs.travels") as string }</IonLabel>
              {travelData.length ? <IonBadge color={'warning'}>{travelData.length}</IonBadge> : undefined}
            </IonTabButton>

            <IonTabButton tab="baggages" href="/baggages">
              <IonIcon aria-hidden="true" icon={briefcaseOutline} />
              <IonLabel>{ t("tabs.baggages") as string }</IonLabel>
              {baggageData.length ? <IonBadge color={'warning'}>{baggageData.length}</IonBadge> : undefined}
            </IonTabButton>

            <IonTabButton tab="store-items" href="/store-items">
              <IonIcon aria-hidden="true" icon={bagOutline} />
              <IonLabel>{ t("tabs.store") as string }</IonLabel>
            </IonTabButton>

            <IonTabButton tab="settings" href="/settings">
              <IonIcon aria-hidden="true" icon={settingsOutline} />
              <IonLabel>{ t("tabs.settings") as string }</IonLabel>
            </IonTabButton>

          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
}

export default App;
