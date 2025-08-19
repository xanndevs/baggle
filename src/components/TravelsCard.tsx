import { createGesture, GestureDetail, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonIcon, IonLabel, useIonPopover } from '@ionic/react';
import React, { useEffect, useRef } from 'react';
import './TravelsCard.css';

import { chevronForwardSharp, pencilSharp, trashSharp } from 'ionicons/icons';
import { pop_uuid, retrive_bag_items } from '../utils/storage';
import BaggleDaysLabel from './BaggleDaysLabel';
import { useTranslation } from 'react-i18next';
import { presentDeleteConfirmation } from '../pages/Settings/modal/DeleteActionSheet';


interface ComponentProps {
  travel: Travel

  modal: React.RefObject<HTMLIonModalElement>
  dispatch: React.Dispatch<FormAction>,
}

  type FormState = {
    travelNameValue: string,
    travelDateValue: Date,
    progress: number,

    uuid?: string,
    isEdit: boolean,
  };
  type FormAction =
    | { type: "UPDATE"; field: keyof FormState; value: string | number | Date | boolean | undefined }
    | { type: "RESET" };


const TravelsCard: React.FC<ComponentProps> = ({ travel, modal, dispatch }) => {
  const { t } = useTranslation();
  const Popover = () =>
    <>
      <IonButton expand='block' size='default' fill='clear' color={'light'} className='popover-button' onClick={ handleEdit }>
        <IonIcon slot="start" color={"primary"} icon={pencilSharp} />
        <IonLabel color={'primary'}>{t("generic.edit") as string}</IonLabel>
      </IonButton>

      <IonButton fill='clear' size='default' className='popover-button' color={'light'} expand='block' onClick={handleDelete}>
        <IonIcon slot="start" color={"danger"} icon={trashSharp} />
        <IonLabel color={'danger'}>{t("generic.delete") as string}</IonLabel>
      </IonButton>
    </>

  const [present, dismiss] = useIonPopover(Popover, {
    onDismiss: (data: any, role: string) => dismiss(data, role),
  });

  const card = useRef<HTMLIonCardElement | null>(null);
  const pressTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const PRESS_DURATION = 400; // milliseconds

  async function handleDelete(): Promise<void> {
    const isConfirmed = await presentDeleteConfirmation();
    if(!isConfirmed) return
     
    const bagUuidList = travel.bags;
    bagUuidList.forEach(async (bagUuid) => {
      const bagItems = await retrive_bag_items(bagUuid);
      if (bagItems) bagItems.forEach((item) =>
        pop_uuid("items", item.uuid)
      )

      pop_uuid("baggages", bagUuid);
    })
    pop_uuid("travels", travel.uuid)
  }

  async function handleEdit(): Promise<void> {
    if(!dispatch || !modal)return
    await dispatch({ type: "RESET" })

    await dispatch({ type: "UPDATE", field: "uuid",             value: travel.uuid, });

    await dispatch({ type: "UPDATE", field: "isEdit",           value: true, });

    await dispatch({ type: "UPDATE", field: "travelNameValue",  value: travel.name, });

    await dispatch({ type: "UPDATE", field: "travelDateValue",  value: travel.date, });
    
    modal.current?.present()
  }




  const onStart = (e: Event) => {
    pressTimeout.current = setTimeout(() => {
      const target =
        (e.target as HTMLElement).id === "trap" && (e.target as HTMLElement).parentElement
          ? (e.target as HTMLElement).parentElement
          : (e.target as HTMLElement);

      //console.log('long press');
      if (card.current) {

        present({
          event: { ...e, target }, // OR just use e but override .target
          translucent: false,
          showBackdrop: true,
          dismissOnSelect: true,
          size: 'auto'
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
          <IonCardSubtitle><IonLabel color={'medium'}>{travel.date?.toString().split(" ", 6).splice(0, 4).join(" ")}</IonLabel> • <BaggleDaysLabel date={travel.date} /></IonCardSubtitle>

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


export default TravelsCard;

