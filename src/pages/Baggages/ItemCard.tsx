

import { createGesture, GestureDetail, IonBadge, IonButton, IonCard, IonCheckbox, IonChip, IonIcon, IonImg, IonLabel, useIonActionSheet, useIonPopover } from '@ionic/react';
import { bagAddOutline, bagAddSharp, bagOutline, imageOutline, pencilSharp, pricetag, pricetagOutline, trashSharp } from 'ionicons/icons';
import React, { useEffect, useRef } from 'react';
import { edit_uuid, pop_uuid } from '../../utils/storage';
import './ItemCard.css';
import { useTranslation } from 'react-i18next';
import { presentDeleteConfirmation, presentReadyOrPackedSelection } from '../Settings/modal/DeleteActionSheet';

interface ContainerProps {
  item: Item;
  dispatch?: React.Dispatch<FormAction>,
  modal?: React.RefObject<HTMLIonModalElement>
}

type FormAction =
  | { type: "UPDATE"; field: keyof FormState; value: string | number | undefined | boolean }
  | { type: "RESET" };
interface FormState extends Item {
  progress?: number;
  nameError?: string;
  title?: string;

  isEdit: boolean
}

const ItemCard: React.FC<ContainerProps> = ({ item, dispatch, modal }) => {
  const { t } = useTranslation();




  const Popover = () =>
    <>
      { item.type !== "store" &&
        <IonButton expand='block' size='default' fill='clear'  color={'light'} className='popover-button' onClick={handleNeeded}>
        <IonIcon slot="start" color={"primary"} style={{position: 'absolute', left: '8px'}} icon={pricetag} />
        <IonLabel color={'primary'} style={{position: 'absolute', left: '32px'}}>{t("items.iDontHaveYet") as string}</IonLabel>
      </IonButton>
      }

      <IonButton expand='block' size='default' fill='clear' color={'light'} className='popover-button' onClick={handleEdit}>
        <IonIcon slot="start" color={"primary"} style={{position: 'absolute', left: '8px'}} icon={pencilSharp} />
        <IonLabel color={'primary'} style={{position: 'absolute', left: '32px'}}>{t("generic.edit") as string}</IonLabel>
      </IonButton>

      <IonButton fill='clear' size='default' className='popover-button' color={'light'} expand='block' onClick={handleDelete}>
        <IonIcon slot="start" color={"danger"} style={{position: 'absolute', left: '8px'}} icon={trashSharp} />
        <IonLabel color={'danger'} style={{position: 'absolute', left: '32px'}}>{t("generic.delete") as string}</IonLabel>
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
    if (!isConfirmed) return;

    pop_uuid("items", item.uuid);
  }

  async function handleEdit(): Promise<void> {
    if (!dispatch || !modal) return
    await dispatch({ type: "RESET" })
    await dispatch({ type: "UPDATE", field: "isEdit", value: true });
    await dispatch({ type: "UPDATE", field: "uuid", value: item.uuid });
    
    await dispatch({ type: "UPDATE", field: "amount", value: item.amount });
    await dispatch({ type: "UPDATE", field: "category", value: item.category });
    await dispatch({ type: "UPDATE", field: "image", value: item.image });
    await dispatch({ type: "UPDATE", field: "name", value: item.name });
    await dispatch({ type: "UPDATE", field: "note", value: item.note });
    await dispatch({ type: "UPDATE", field: "price", value: item.price });
    await dispatch({ type: "UPDATE", field: "type", value: item.type });

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








  const handleChecked = async () => {
    if (item.type === "store") {
      const status = await presentReadyOrPackedSelection();
      if (!status) return;

      edit_uuid(
        `items.${item.uuid}`,
        {
          ...item,
          type: status
        }
      );
      return;
    }


    edit_uuid(
      `items.${item.uuid}`,
      {
        ...item,
        type: item.type === "packed" ? "ready" : "packed"
      }
    );
    return;

  }

  const handleNeeded = () => {

    edit_uuid(
      `items.${item.uuid}`,
      {
        ...item,
        type: "store"
      }
    );
    return;

  }


  return (
    <IonCard className='item-card' onClick={handleChecked} ref={card} button>

      <div className='item-card-content' >
        <IonBadge className='item-amount'>x{item.amount}</IonBadge>
        {
          !item.image ?
            <div className='item-image' style={{ display: 'flex', }}>
              <IonIcon size='large' icon={imageOutline}></IonIcon>

            </div> :
            <IonImg src={item.image ? 'data:image/jpeg;base64,' + item.image : ""} className='item-image' style={{ display: 'flex', }}>
            </IonImg>
        }



        <div className='item-details'>
          <div style={{ display: 'flex', gap: "4px", alignItems: 'center' }}>
            <IonLabel className='item-title'>{item.name || t("items.unnamed") as string}</IonLabel>
            {
              item.price ?
                <IonChip className='item-price'>{item.price}₺</IonChip> : undefined
            }
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '4px', alignItems: 'flex-start', height: '100%' }}>
            <IonLabel style={{ flexGrow: 1 }} color={'primary'} className='item-note'>{item.note || t("items.noteNotProvided") as string}</IonLabel>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'baseline', justifyContent: 'flex-end', height: '100%', minWidth: 'min-content' }}>
              <IonCheckbox checked={item.type === "packed"} ></IonCheckbox>
            </div>

          </div>
        </div>
      </div>
    </IonCard>
  );

}

export default ItemCard;