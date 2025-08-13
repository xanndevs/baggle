import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonIcon, IonLabel } from '@ionic/react';
import { checkmarkDoneSharp, checkmarkSharp, chevronForwardSharp, pricetagSharp } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { get, retrive_bag_items, subscribe } from '../../utils/storage';
import './TravelDetails.css';

interface ComponentProps{
  bag: Bag,
  style?: React.CSSProperties
}

const BagContainer: React.FC<ComponentProps> = ({ bag, style }) => {

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

        <IonCard className='margin-none baggage-card' color={"light"} button routerLink={`/baggages/${bag.uuid}`} style={style}>
          <IonCardHeader className='padding-bottom-none' style={{ padding: '1rem 1rem 0' }}>
            <IonCardSubtitle>Has {bag.category?.length || "No"} Categories</IonCardSubtitle>

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
