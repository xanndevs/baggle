

import { createGesture, GestureDetail, IonBadge, IonButton, IonCard, IonCheckbox, IonChip, IonIcon, IonImg, IonLabel, useIonActionSheet, useIonPopover } from '@ionic/react';
import { imageOutline, pencilSharp, trashSharp } from 'ionicons/icons';
import React, { useEffect, useRef } from 'react';
import { edit_uuid, pop_uuid } from '../../utils/storage';
import './ItemCard.css';

const ItemCard: React.FC<{ item: Item }> = ({ item }) => {





      const Popover = () =>
    <>
      <IonButton expand='block' size='default' fill='clear' color={'light'} className='popover-button' onClick={() => { /*alert("Editioriique espaganzo!\n\nMekanic (/-_-)/")  */ }}>
        <IonIcon slot="start" color={"primary"} icon={pencilSharp} />
        <IonLabel color={'primary'}>Edit</IonLabel>
      </IonButton>

      <IonButton fill='clear' size='default' className='popover-button' color={'light'} expand='block' onClick={handleDelete}>
        <IonIcon slot="start" color={"danger"} icon={trashSharp} />
        <IonLabel color={'danger'}>Delete</IonLabel>
      </IonButton>
    </>

  const [present, dismiss] = useIonPopover(Popover, {
    onDismiss: (data: any, role: string) => dismiss(data, role),
  });

  const card = useRef<HTMLIonCardElement | null>(null);
  const pressTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const PRESS_DURATION = 400; // milliseconds

  async function handleDelete(): Promise<void> {
    pop_uuid("items", item.uuid);

    // const bagUuidList = travel.bags;
    // bagUuidList.forEach(async (bagUuid) => {
    //   const bagItems = await retrive_bag_items(bagUuid);
    //   if (bagItems) bagItems.forEach((item) =>
    //     pop_uuid("items", item.uuid)
    //   )

    //   pop_uuid("baggages", bagUuid);
    // })
    // pop_uuid("travels", travel.uuid)
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







      const [presentActionSheet] = useIonActionSheet();

    const handleChecked = () => {
        presentActionSheet({
            header: 'Item Actions',
            buttons: [
                {
                    text: item.type === "packed" ? "unpack" : "pack",
                    handler: () => alert(1),
                },
                {
                    text: 'Delete',
                    role: 'destructive',
                    handler: () => alert(2),
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                }
            ],
            cssClass: 'my-custom-class',
        });

        if (item.type === "store") return;
        edit_uuid(
            `items.${item.uuid}`,
            {
                ...item,
                type: item.type === "packed" ? "ready" : "packed"
            }
        );
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
                        <IonLabel className='item-title'>{item.name || "Unnamed Item"}</IonLabel>
                        {
                            item.price ?
                                <IonChip className='item-price'>{item.price}₺</IonChip> : undefined
                        }
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '4px', alignItems: 'flex-start', height: '100%' }}>
                        <IonLabel style={{ flexGrow: 1 }} color={'primary'} className='item-note'>{item.note || "No note provided. "}</IonLabel>

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