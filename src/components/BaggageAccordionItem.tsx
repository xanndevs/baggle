import React, { useEffect, useRef, useState } from 'react';
import { IonAccordion, IonBadge, IonChip, IonIcon, IonItem, IonLabel } from '@ionic/react';
import { briefcaseSharp, calendarClearSharp, checkmarkDoneSharp, checkmarkSharp, chevronForward, pricetagSharp, sadSharp } from 'ionicons/icons';
import BaggleDaysLabel from './BaggleDaysLabel';

interface ContainerProps {
  uuid?: string,
}

const BaggageAccordionItem: React.FC<ContainerProps> = ({ uuid }) => {
  const [bagValues, setBagValues] = useState<Bag[]>([]);


  const button = useRef(null);


  useEffect(() => {
    const fetchBags = async () => {
      //Get bags from the api?
      //Since I have no api  I will jsut define a fake response
      //res = askforbags([,"678-36-425469","904-53-4535"]) // the holly api call

      // a white old wizard arrived with the response
      const res: { bags: Bag[] } = {

        bags: [
          {
            uuid: "uuid-best",
            name: "Valiz",
            items: [
              { type: 'packed', name: "Ekmek", amount: 3 },
              { type: 'ready', name: "Ayakkabı", amount: 3 },
              { type: 'store', name: "Balık", amount: 3, price: 300 }
            ],
          },
          {
            uuid: "uuis-notbest",
            name: "Sırt Çantası",
            items: [
              { type: 'ready', name: "Ekmek", amount: 3 },
              { type: 'packed', name: "Ekmek", amount: 3 }
            ],
          }
        ]
      }


      setBagValues(res.bags/*.filter(elem => elem.uuid === uuid)*/)
    }

    fetchBags();
  }, []);

  return (
    //#region Render_travel
    <IonAccordion toggleIcon={chevronForward} ref={button} value={`accordion-${/*value*/ "test"}`}>
      <IonItem slot="header" >

        <IonLabel>
          {/* {name} */}
        </IonLabel>

        <IonChip ref={button} outline>
          <IonIcon icon={briefcaseSharp}></IonIcon>
          <IonLabel>x{bagValues?.length || 0}</IonLabel>
        </IonChip>
        <IonChip outline={true}>
          <IonIcon icon={calendarClearSharp}></IonIcon>
          <IonLabel>
            {
              //currently it substracts the current date from the travel date
              //and the result is just a number of milliseconds so I need to make it days
              // date ? <BaggleDaysLabel remainingDays={Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} /> : undefined
            }
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

            {bag.items.filter((elem) => elem.type === 'store').length ? (
              <IonChip disabled={true}>
                <IonIcon icon={pricetagSharp}></IonIcon>
                <IonLabel>x{bag.items.filter((elem) => elem.type === 'store').length}</IonLabel>
              </IonChip>
            ) : null}
            <IonChip disabled={true}>
              <IonIcon icon={checkmarkSharp}></IonIcon>
              <IonLabel>x{bag.items.filter((elem) => elem.type === 'ready').length}</IonLabel>
            </IonChip>

            <IonChip disabled={true}>
              <IonIcon icon={checkmarkDoneSharp}></IonIcon>
              <IonLabel>x{bag.items.filter((elem) => elem.type === 'packed').length}</IonLabel>
            </IonChip>
          </IonItem>
        ))
        // #endregion
      }






    </IonAccordion>
  );
};

export default BaggageAccordionItem;