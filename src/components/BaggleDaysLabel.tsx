import React from 'react';
import { IonLabel } from '@ionic/react';

interface ContainerProps {
  remainingDays: number;
}

const BaggleDaysLabel: React.FC<ContainerProps> = ({ remainingDays }) => {
  const negToPosFix = 2;
  const numOverlapFix = 3;
  const numOverlapNoFix = 0;
  return (
    <>
      {
        {
          1: <IonLabel>Yesterday</IonLabel>,
          2: <IonLabel>Today</IonLabel>,
          3: <IonLabel>Tomorrow</IonLabel>,
          4: <IonLabel>{-remainingDays} Days Past</IonLabel>,
          5: <IonLabel>Today</IonLabel>,
          6: <IonLabel>{remainingDays} Days Later</IonLabel>,
        }[(Math.sign(remainingDays) + negToPosFix) + (Math.abs(remainingDays) > 1 ? numOverlapFix : numOverlapNoFix)]
      }
    </>
  );
};

export default BaggleDaysLabel;