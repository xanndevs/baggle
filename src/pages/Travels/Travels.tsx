import {
  IonContent, IonFab, IonFabButton,
  IonHeader, IonIcon, IonModal, IonPage, IonTitle, IonToolbar
} from '@ionic/react';
import { addSharp } from 'ionicons/icons';
import React, { useReducer, useRef } from 'react';
import TravelsCard from '../../components/TravelsCard';
import AddTravelModal from './modal/AddTravelModal';
import './Travels.css';

interface ComponentProps { travels: Travel[] }

const Travels: React.FC<ComponentProps> = ({ travels }) => {

  const modal = useRef<HTMLIonModalElement>(null);


  type FormState = {
    travelNameValue: string,
    travelDateValue: Date,
    progress: number,
  };
  type FormAction =
    | { type: "UPDATE"; field: keyof FormState; value: string | number | Date }
    | { type: "RESET" };

  const formReducer = (state: FormState, action: FormAction) => {
    switch (action.type) {
      case "UPDATE":
        return { ...state, [action.field]: action.value };
      case "RESET":
        return {
          travelNameValue: "",
          travelDateValue: new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate(),
            6, 30, 0, 0
          ),


          progress: 0.02,
        };
      default:
        return state;
    }
  }

  const [formState, dispatch] = useReducer(formReducer, {
    travelNameValue: "",
    travelDateValue: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
      6, 30, 0, 0
    ),

    progress: 0.02
  })



  // const setModal = () => {
  //   dispatch({
  //     type: "RESET",
  //   })
  // };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Travels</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Travels</IonTitle>
          </IonToolbar>
        </IonHeader>
        {
          sortTravels(travels).map((elem, index) =>
            <TravelsCard key={index} travel={elem} />
          )
        }

        <IonFab slot="fixed" vertical="bottom" horizontal="end" id="open-modal">
          <IonFabButton >
            <IonIcon icon={addSharp}></IonIcon>
          </IonFabButton>
        </IonFab>
        <IonModal
          ref={modal}
          trigger="open-modal"
          initialBreakpoint={1}
          breakpoints={[0, 1]}
          keepContentsMounted
          canDismiss={true}
          handleBehavior="none"
          id='new-travel-modal'
        >
          <AddTravelModal
            modal={modal}
            formState={formState}
            dispatch={dispatch}
          />
        </IonModal>

      </IonContent>
    </IonPage>
  );
};


function sortTravels(travels: Travel[]): Travel[] {
  return [...travels].sort((a, b) => {
    const daysA = calculateRemainingDays(a.date);
    const daysB = calculateRemainingDays(b.date);

    const priority = (days: number) => {
      if (days >= 0 && days <= 3) return 0;   // Group 1: 0–3 days
      if (days > 3) return 1;                 // Group 2: >3 days
      return 2;                               // Group 3: Past
    };

    const groupA = priority(daysA);
    const groupB = priority(daysB);

    if (groupA !== groupB) {
      return groupA - groupB; // First sort by group
    }

    // Within group, sort differently depending on the group
    if (groupA === 2) {
      // Group 3: Past — descending (closest past first)
      return daysB - daysA;
    } else {
      // Groups 1 and 2: ascending (soonest first)
      return daysA - daysB;
    }
  });
}

function calculateRemainingDays(dateStr: string | Date | null | undefined): number {
  if (!dateStr) return 0;  // If the date is invalid, return 0 (or handle it however you want)

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 0;  // Handle invalid date cases

  const remainingMilliseconds = date.getTime() - Date.now();
  return (remainingMilliseconds / (1000 * 60 * 60 * 24));  // Convert milliseconds to full days
}


export default Travels;
