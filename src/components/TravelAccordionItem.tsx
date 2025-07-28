import React, { useEffect, useState } from 'react';
import { IonAccordion, IonBadge, IonChip, IonIcon, IonItem, IonLabel } from '@ionic/react';
import { briefcaseSharp, calendarClearSharp, checkmarkDoneSharp, checkmarkSharp, pricetagSharp, sadSharp } from 'ionicons/icons';
import BaggleDaysLabel from './BaggleDaysLabel';

interface ContainerProps {
  uuid?: string,
  name: string,
  remainingDays: number,
  bags?: string[],
  value: string,
}

const TravelAccordionItem: React.FC<ContainerProps> = ({ uuid, name, remainingDays, bags, value }) => {
  const [bagValues, setBagValues] = useState<Bag[]>([]);

  useEffect(() => {
    const fetchBags = async () => {
      //Get bags from the api?
      //Since I have no api  I will jsut define a fake response
      //res = askforbags([,"678-36-425469","904-53-4535"]) // the holly api call

      // a white old wizard arrived with the response
      const res = {
        bags: [
          {
            uuid: "uuid-best",
            name: "Valiz",
            itemsPacked: [
              {name: "Ekmek", amount: 3}
            ],
            itemsReady: [
              {name: "Ekmek", amount: 3}
            ],
            itemsStore: [
              {name: "Ekmek", amount: 3, price: 300}
            ],
          },
          {
            uuid: "uuis-notbest",
            name: "Sırt Çantası",
            itemsPacked: [
              {name: "Ekmek", amount: 3}
            ],
            itemsReady: [
              {name: "Ekmek", amount: 3}
            ],
          }
        ]
      }

      setBagValues(res.bags);
    }

    fetchBags();
  }, []);

  return (
    //#region Render_travel
    <IonAccordion value={`accordion-${value}`} >
      <IonItem slot="header" >

        <IonLabel>
          {name}
        </IonLabel>

        <IonChip outline>
          <IonIcon icon={briefcaseSharp}></IonIcon>
          <IonLabel>x{bagValues?.length || 0}</IonLabel>
        </IonChip>
        <IonChip outline={true}>
          <IonIcon icon={calendarClearSharp}></IonIcon>
          <IonLabel>
            <BaggleDaysLabel remainingDays={remainingDays} />
          </IonLabel>

        </IonChip>
      </IonItem>

      {
        //#region Render_bags
        bagValues?.map((bag, index) => (
          <IonItem key={index} button={true} detail={true} slot="content" routerLink={`/baggages/${bag.uuid}`}>
            <IonIcon icon={sadSharp}></IonIcon>
            &nbsp;&nbsp;
            <IonLabel style={{ flex: "1" }}>{bag.name}</IonLabel>

            {bag.itemsStore ? (
              <IonChip disabled={true}>
                <IonIcon icon={pricetagSharp}></IonIcon>
                <IonLabel>x{bag.itemsStore.length}</IonLabel>
              </IonChip>
            ) : null}
            <IonChip disabled={true}>
              <IonIcon icon={checkmarkSharp}></IonIcon>
              <IonLabel>x{bag.itemsReady.length}</IonLabel>
            </IonChip>

            <IonChip disabled={true}>
              <IonIcon icon={checkmarkDoneSharp}></IonIcon>
              <IonLabel>x{bag.itemsPacked.length}</IonLabel>
            </IonChip>
          </IonItem>
        ))
        // #endregion
      }






    </IonAccordion>
  );
};

export default TravelAccordionItem;