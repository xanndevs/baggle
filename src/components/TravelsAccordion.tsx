import React, { useEffect } from 'react';
import { IonAccordionGroup } from '@ionic/react';
import './TravelAccordion.css';
import TravelAccordionItem from './TravelAccordionItem';

import { get, set, subscribe } from '../utils/storage';


interface ComponentProps{
  travels: Travel[]
}
const TravelsAccordion: React.FC<ComponentProps> = ({ travels }) => {

  return (
    <IonAccordionGroup animated>

      {
        travels.map((elem, index) =>
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