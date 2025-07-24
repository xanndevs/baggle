import React from 'react';
import { IonAccordion, IonAccordionGroup, IonAvatar, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonText, IonTitle } from '@ionic/react';
import './ExploreContainer.css';
import { briefcaseSharp, calendarClearSharp, checkmarkDoneCircleSharp, checkmarkDoneSharp, checkmarkSharp, logoAndroid, pricetagSharp, sadSharp } from 'ionicons/icons';

interface ContainerProps {
  name: string;
}

const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {
  return (
    <IonAccordionGroup>
      <IonAccordion value="first">
        <IonItem slot="header" color="light" >

          <IonLabel>
            Ankara Yolculuğu
          </IonLabel>

          <IonChip outline={true}>
            <IonIcon icon={briefcaseSharp}></IonIcon>
            <IonLabel>x2</IonLabel>
          </IonChip>
          <IonChip outline={true}>
            <IonIcon icon={calendarClearSharp}></IonIcon>
            <IonLabel>29 Days Left</IonLabel>
          </IonChip>



        </IonItem>

        <IonItem button={true} detail={true} slot="content">
          <IonIcon icon={sadSharp}></IonIcon>
          &nbsp;&nbsp;
          <IonLabel style={{ flex: "1" }}>Valiz</IonLabel>
          <IonChip disabled={true}>
            <IonIcon icon={pricetagSharp}></IonIcon>
            <IonLabel>x3</IonLabel>
          </IonChip>
          <IonChip disabled={true}>
            <IonIcon icon={checkmarkSharp}></IonIcon>
            <IonLabel>x3</IonLabel>
          </IonChip>

          <IonChip disabled={true}>
            <IonIcon icon={checkmarkDoneSharp}></IonIcon>
            <IonLabel>x3</IonLabel>
          </IonChip>
        </IonItem>

        <IonItem button={true} detail={true} slot="content">
          <IonIcon icon={sadSharp}></IonIcon>
          &nbsp;&nbsp;
          <IonLabel style={{ flex: "1" }}>Sırt Çantası</IonLabel>
          <IonChip disabled={true}>
            <IonIcon icon={pricetagSharp}></IonIcon>
            <IonLabel>x1</IonLabel>
          </IonChip>
          <IonChip disabled={true}>
            <IonIcon icon={checkmarkSharp}></IonIcon>
            <IonLabel>x5</IonLabel>
          </IonChip>

          <IonChip disabled={true}>
            <IonIcon icon={checkmarkDoneSharp}></IonIcon>
            <IonLabel>x11</IonLabel>
          </IonChip>
        </IonItem>



      </IonAccordion>

    </IonAccordionGroup>
  );
};

export default ExploreContainer;