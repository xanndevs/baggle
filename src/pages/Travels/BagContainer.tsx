import React, { useEffect, useState } from 'react';
import { IonAccordionGroup, IonBackButton, IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCheckbox, IonChip, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonItem, IonItemDivider, IonItemGroup, IonLabel, IonList, IonListHeader, IonPage, IonRow, IonSearchbar, IonText, IonTitle, IonToolbar, isPlatform } from '@ionic/react';
import TravelsCard from '../../components/TravelsCard';
import './TravelDetails.css';
import WalrusBucket from '../../walrus_bucket.jpg';
import { useParams } from 'react-router';
import { get, retrive_bag_items, subscribe } from '../../utils/storage';
import { checkmarkDoneSharp, checkmarkSharp, chevronForwardSharp, pricetagSharp, sadSharp } from 'ionicons/icons';
import BaggageAccordionItem from '../../components/BaggageAccordionItem';

interface ComponentProps{
  bag: Bag
}

const BagContainer: React.FC<ComponentProps> = ({ bag }) => {

  const [itemList, setItemList] = useState<Item[]>([]);



  useEffect(() => {
    const fetchItems = async () => {
      const items = await retrive_bag_items(bag.uuid);
      if (items) setItemList(items);
      
    }
    fetchItems()

  },[])

  return (
    <>
      <IonCol size='10' style={{ minWidth: '285px' }} >
        <IonCard className='margin-none baggage-card' color={"light"} button routerLink={`/baggages/${bag.uuid}`} >
          <IonCardHeader className='padding-bottom-none'>
            <IonCardSubtitle>Has {bag.category?.length || "No"} Categories</IonCardSubtitle>

            <IonCardTitle className='flex-middle'>
              {bag.name}

            </IonCardTitle>

          </IonCardHeader>

          <IonCardContent className='flex-middle space-between'>
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
      </IonCol>

    </>
  );

};

export default BagContainer;
