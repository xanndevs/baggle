import React from 'react';
import { IonAccordionGroup } from '@ionic/react';
import './TravelAccordion.css';
import TravelAccordionItem from './TravelAccordionItem';

//interface ContainerProps {}

const TravelsAccordion/*: React.FC<ContainerProps> */= () => {



  return (
    <IonAccordionGroup>
      <TravelAccordionItem
        name={"Ankara Yolculuğu"}
        bags={["uuid-best", "uuid-notbest"]}
        remainingDays={0}

      />

    </IonAccordionGroup>
  );
};

export default TravelsAccordion;