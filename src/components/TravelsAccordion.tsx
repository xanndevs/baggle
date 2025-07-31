import React, { useEffect } from 'react';
import { IonAccordionGroup } from '@ionic/react';
import './TravelAccordion.css';
import TravelAccordionItem from './TravelAccordionItem';

import { get, set, subscribe } from '../utils/storage';


//interface ContainerProps {}

const TravelsAccordion/*: React.FC<ContainerProps> */ = () => {

  const [travelData, setTravelData] = React.useState<Travel[]>([]);

useEffect(() => {
  let isMounted = true;

  const setup = async () => {
    const travels = await get<Travel[]>("travels");
    if (isMounted) {
      if (travels) {
        console.log("Travel data loaded:", travels);
        
        setTravelData(travels);
      } else {
        await set("travels", []);
        //setTravelData([]);
      }
    }
  };

  setup();

  const unsub = subscribe<Travel[]>('travels', (travels) => {
    if (isMounted) {
      console.log("Travel data updated:", travels);

      setTravelData(travels);
    }
  });

  return () => {
    isMounted = false;
    unsub();
  };
}, []);



  return (
    <IonAccordionGroup animated>

      {
        travelData.map((elem, index) =>
          <TravelAccordionItem
            name={elem.name}
            bags={elem.bags}
            date={elem.date}
            key={index}
            value={index.toString()}
          />)


      }

    </IonAccordionGroup>
  );
};

export default TravelsAccordion;