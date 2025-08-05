import React from 'react';
import { IonLabel } from '@ionic/react';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  remainingDays: number;
}

const BaggleDaysLabel: React.FC<ContainerProps> = ({ remainingDays, ...props }) => {
  const negToPosFix = 2;
  const numOverlapFix = 3;
  const numOverlapNoFix = 0;

  return (



      <IonLabel color={props.color}>
        {
          {
            1: "Yesterday",
            2: "Today",
            3: "Tomorrow",
            4: `${-remainingDays} Days Past`,
            5: "Today",
            6: `${remainingDays} Days Later`
          }[(Math.sign(remainingDays) + negToPosFix) + (Math.abs(remainingDays) > 1 ? numOverlapFix : numOverlapNoFix)]
        }
      </IonLabel>

  );
};

export default BaggleDaysLabel;