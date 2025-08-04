import React, { useEffect } from 'react';
import { IonAccordionGroup, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonIcon, IonLabel } from '@ionic/react';
import './TravelAccordion.css';

import { get, set, subscribe } from '../utils/storage';
import { chevronForwardSharp, pricetagSharp } from 'ionicons/icons';
import BaggleDaysLabel from './BaggleDaysLabel';


interface ComponentProps {
  travels: Travel[]
}
const TravelsAccordion: React.FC<ComponentProps> = ({ travels }) => {
function calculateRemainingDays(dateStr: string | null | undefined): number {
  if (!dateStr) return 0;  // If the date is invalid, return 0 (or handle it however you want)

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 0;  // Handle invalid date cases
  
  const remainingMilliseconds = date.getTime() - Date.now();
  return Math.floor(remainingMilliseconds / (1000 * 60 * 60 * 24));  // Convert milliseconds to full days
}

  return (
    <>
      {
        travels.map((elem, index) => <>
        
        <IonCard key={index} className='card-margin' color={"light"} button routerLink={`/travels/${elem.uuid}`}>
        <IonCardHeader className='padding-bottom-none'>
          <IonCardSubtitle>{elem.date?.toString().split(" ", 6).splice(0,5).join(" ")}</IonCardSubtitle>

          <IonCardTitle className='flex-middle'>
            {elem.name} <IonChip disabled><BaggleDaysLabel remainingDays={calculateRemainingDays(elem.date)}/></IonChip>
          </IonCardTitle>

        </IonCardHeader>

        <IonCardContent className='flex-middle space-between'>
          <div></div>
          <IonIcon size='small' color='primary' icon={chevronForwardSharp}></IonIcon>
        </IonCardContent>

      </IonCard>
        </>)


      }

    </>
  );
};

export default TravelsAccordion;