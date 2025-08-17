import { createGesture, GestureDetail, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonIcon, IonLabel, useIonPopover } from '@ionic/react';
import { checkmarkDoneSharp, checkmarkSharp, chevronForwardSharp, pencilSharp, pricetagSharp, trashSharp } from 'ionicons/icons';
import React, { useEffect, useRef, useState } from 'react';
import { get, pop_uuid, retrive_bag_items, subscribe } from '../../utils/storage';
import './TravelDetails.css';
import { t } from 'i18next';

interface ComponentProps {
  bag: Bag,
  style?: React.CSSProperties
}

const BagContainer: React.FC<ComponentProps> = ({ bag, style }) => {


  const Popover = () =>
    <>
      <IonButton expand='block' size='default' fill='clear' color={'light'} className='popover-button' onClick={() => { /*alert("Editioriique espaganzo!\n\nMekanic (/-_-)/")  */ }}>
        <IonIcon slot="start" color={"primary"} icon={pencilSharp} />
        <IonLabel color={'primary'}>{t("generic.edit")}</IonLabel>
      </IonButton>

      <IonButton fill='clear' size='default' className='popover-button' color={'light'} expand='block' onClick={handleDelete}>
        <IonIcon slot="start" color={"danger"} icon={trashSharp} />
        <IonLabel color={'danger'}>{t("generic.delete")}</IonLabel>
      </IonButton>
    </>

  const [present, dismiss] = useIonPopover(Popover, {
    onDismiss: (data: any, role: string) => dismiss(data, role),
  });

  const card = useRef<HTMLIonCardElement | null>(null);
  const pressTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const PRESS_DURATION = 400; // milliseconds

  async function handleDelete(): Promise<void> {
    const itemsUuidList = bag.items;
    itemsUuidList.forEach(async (item) => await pop_uuid("items", item));
    await pop_uuid("baggages", bag.uuid);

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









  const [itemList, setItemList] = useState<Item[]>([]);




  useEffect(() => {
    let isMounted = true;

    const setup = async () => {
      const items = await retrive_bag_items(bag.uuid);

      if (isMounted && items) setItemList(items);
    };

    setup();

    const unsub_items = subscribe<Item[]>('items', (items) => {
      if (isMounted) { setItemList(items); }
    });





    return () => {
      isMounted = false;
      unsub_items();
    };
  }, []);



  return (
    <>

      <IonCard className='margin-none baggage-card' color={"light"} routerLink={`/baggages/${bag.uuid}`} style={style} ref={card}>
        <IonCardHeader className='padding-bottom-none' style={{ padding: '1rem 1rem 0' }}>
          <IonCardSubtitle>{
            bag.category?
              t("baggages.categoryCount", {count:bag.category.length} ) : 
              t("baggages.categoryCountEmpty")
      
          }</IonCardSubtitle>

          <IonCardTitle className='flex-middle card-title-text'>
            {bag.name}

          </IonCardTitle>

        </IonCardHeader>

        <IonCardContent className='flex-middle space-between' style={{ padding: '0 1rem 1rem ' }}>
          <div>

            {itemList?.filter((elem) => elem.type === 'store').length ? (
              <IonChip disabled={true}>
                <IonIcon icon={pricetagSharp}></IonIcon>
                <IonLabel>x{itemList?.filter((elem) => elem.type === 'store').length}</IonLabel>
              </IonChip>
            ) : null}
            <IonChip disabled={true}>
              <IonIcon icon={checkmarkSharp}></IonIcon>
              <IonLabel>x{itemList?.filter((elem) => elem.type === 'ready').length}</IonLabel>
            </IonChip>

            <IonChip disabled={true}>
              <IonIcon icon={checkmarkDoneSharp}></IonIcon>
              <IonLabel>x{itemList?.filter((elem) => elem.type === 'packed').length}</IonLabel>
            </IonChip>

          </div>
          <IonIcon size='small' color='primary' icon={chevronForwardSharp}></IonIcon>
        </IonCardContent>

      </IonCard>

    </>
  );

};

export default BagContainer;
