import React, { useEffect, useState } from 'react';
import { IonAccordion, IonBadge, IonChip, IonIcon, IonItem, IonLabel } from '@ionic/react';
import { briefcaseSharp, calendarClearSharp, checkmarkDoneSharp, checkmarkSharp, pricetagSharp, sadSharp } from 'ionicons/icons';
import BaggleDaysLabel from './BaggleDaysLabel';

interface ContainerProps {
  uuid?: string,
  name: string,
  items?: string[],
  value: string,
}

const ItemsAccordionItem: React.FC<ContainerProps> = ({ uuid = "", name = "", items, value }) => {

  return (
    //#region Render_travel
    <IonAccordion value={`accordion-${value}`} >
      <IonItem slot="header" >

        <IonLabel>
          {name}
        </IonLabel>

      </IonItem>

      {
        //#region Render_bags
        items?.map((item, index) => (
          <IonItem key={index} button={true} detail={true} slot="content">
            lkfjgşlk
          </IonItem>
        ))
        // #endregion
      }






    </IonAccordion>
  );
};

export default ItemsAccordionItem;