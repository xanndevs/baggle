import React, { useEffect, useRef } from 'react';
import { createGesture, GestureDetail, IonAccordionGroup, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonContent, IonIcon, IonItemDivider, IonLabel, IonText, useIonPopover } from '@ionic/react';
import './TravelsCard.css';

import { chevronForwardSharp, pencilSharp, prismSharp, trashBinOutline, trashBinSharp, trashSharp } from 'ionicons/icons';
import BaggleDaysLabel from './BaggleDaysLabel';
import { pop_uuid } from '../utils/storage';


interface ComponentProps {
  travel: Travel
}
const TravelsCard: React.FC<ComponentProps> = ({ travel }) => {
  const Popover = () =>
    <>
        <IonButton expand='block' size='default' fill='clear' color={'light'} className='popover-button'  onClick={() => { alert("Editioriique espaganzo!\n\nMekanic (/-_-)/") }}>
          <IonIcon slot="start" color={"primary"} icon={pencilSharp} />
          <IonLabel color={'primary'}>Edit</IonLabel>
        </IonButton>

        <IonButton fill='clear' size='default' className='popover-button' color={'light'} expand='block'  onClick={() => { alert("Oh no el deletianzo!\n\nItalia Mentzionate!!!"); pop_uuid("travels", travel.uuid) }}>
          <IonIcon slot="start" color={"danger"} icon={trashSharp} />
          <IonLabel color={'danger'}>Delete</IonLabel>
        </IonButton>
    </>

  const [present, dismiss] = useIonPopover(Popover, {
    onDismiss: (data: any, role: string) => dismiss(data, role),
  });

  const card = useRef<HTMLIonCardElement | null>(null);
  const pressTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const PRESS_DURATION = 350; // milliseconds

  const onStart = (e: any) => {
    pressTimeout.current = setTimeout(() => {
      const modEvent = {
        ...e,
        target: (e.target as HTMLElement).id === "trap" && (e.target as HTMLElement).parentElement
          ? (e.target as HTMLElement).parentElement
          : e.target
      };

      //console.log('long press');
      if (card.current) {

        present({
          translucent: false,
          showBackdrop: true,
          dismissOnSelect: true,
          size: 'auto',
          event: modEvent, // needed for positioning
        });

      }
    }, PRESS_DURATION);
  };
const MOVE_CANCEL_THRESHOLD = 6; // px

  const onMove = (detail: GestureDetail) => {
  const movedX = Math.abs(detail.deltaX);
  const movedY = Math.abs(detail.deltaY);

  if (movedX > MOVE_CANCEL_THRESHOLD || movedY > MOVE_CANCEL_THRESHOLD) {
    if (pressTimeout.current) {
      clearTimeout(pressTimeout.current);
      pressTimeout.current = null;
    }
  }
};

  const onEnd = () => {
    if (pressTimeout.current) {
      clearTimeout(pressTimeout.current);
      pressTimeout.current = null;
    }
    if (card.current) {
      //
    }
  };

  useEffect(() => {
    if (card.current) {
      const gesture = createGesture({
        el: card.current,
        gestureName: 'press-gesture',
        threshold: 0,
        onStart: (detail) => onStart(detail.event),
        onMove,
        onEnd,
      });

      gesture.enable();
    }
  }, []);

  return (
    <>
      <IonCard ref={card} className='card-margin' color={"light"} button routerLink={`/travels/${travel.uuid}`} >
        <IonCardHeader className='padding-bottom-none padding-small'>
          <IonCardSubtitle><IonLabel color={'medium'}>{travel.date?.toString().split(" ", 6).splice(0, 4).join(" ")}</IonLabel> • <BaggleDaysLabel color={calculateColor(travel.date)} remainingDays={calculateRemainingDays(travel.date)} /></IonCardSubtitle>

          <IonCardTitle className='flex-middle'>
            {travel.name} 
          </IonCardTitle>

        </IonCardHeader>

        <IonCardContent className='flex-middle space-between'>
          <div></div>
          <IonIcon size='small' color='primary' icon={chevronForwardSharp} id='trap'></IonIcon>
        </IonCardContent>

      </IonCard>


    </>
  );
};

function calculateRemainingDays(dateStr: string | null | undefined): number {
  if (!dateStr) return 0;  // If the date is invalid, return 0 (or handle it however you want)

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 0;  // Handle invalid date cases

  const remainingMilliseconds = date.getTime() - Date.now();
  return Math.floor(remainingMilliseconds / (1000 * 60 * 60 * 24));  // Convert milliseconds to full days
}

function calculateColor(date: string | null | undefined){
  const days = calculateRemainingDays(date); 
    if (days > 3) {
      return "medium"
    } 
    else if (days >= 0) {
      return "warning"
    } else {
      return "danger"
    }
}
export default TravelsCard;