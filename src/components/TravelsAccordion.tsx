import React from 'react';
import { IonAccordionGroup } from '@ionic/react';
import './TravelAccordion.css';
import TravelAccordionItem from './TravelAccordionItem';

//interface ContainerProps {}

const TravelsAccordion/*: React.FC<ContainerProps> */ = () => {



  return (
    <IonAccordionGroup animated>

      {
        Array.from([1, 3, 4, 47, 5,7,6,6,6,6,6]).map((elem, index) =>
          <TravelAccordionItem
            name={"Ankara -kol"}
            bags={["uuid-best", "uuid-notbest"]}
            remainingDays={0}
            key={index}
            value={index.toString()}
          />)


      }

    </IonAccordionGroup>
  );
};

export default TravelsAccordion;