import React, { useEffect } from 'react';
import { IonLabel } from '@ionic/react';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  date?: string;
}

const BaggleDaysLabel: React.FC<ContainerProps> = ({ date }) => {
  const negToPosFix = 2;
  const numOverlapFix = 3;
  const numOverlapNoFix = 0;
  const [remainingDays, setRemainingDays] = React.useState<number>(0);
  const [remainingHours, setRemainingHours] = React.useState<number>(0);

  useEffect(() => {
    setRemainingDays(calculateRemainingDays(date));
    setRemainingHours(calculateRemainingHours(date));
  }, [date, setInterval(() => { return }, 10000)]);


  function calculateRemainingDays(dateStr: string | null | undefined): number {
    if (!dateStr) return 0;

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 0;

    const now = new Date();

    // Set both dates to midnight to compare only the calendar day
    const dateMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const diffMilliseconds = dateMidnight.getTime() - nowMidnight.getTime();
    return Math.round(diffMilliseconds / (1000 * 60 * 60 * 24));
  }

  function calculateRemainingHours(dateStr: string | null | undefined): number {
    if (!dateStr) return 0;  // If the date is invalid, return 0 (or handle it however you want)

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 0;  // Handle invalid date cases

    const remainingMilliseconds = date.getTime() - Date.now();
    return Math.floor(remainingMilliseconds / (1000 * 60 * 60));  // Convert milliseconds to full hours
  }

  function calculateColor() {
    const days = remainingDays
    const hours = remainingHours

    if (days > 3) {
      return "medium"
    }
    else if (days >= 0) {
      if (hours > 0) { return "warning" }
      if (hours === 0) { return "success" } 
      else { return "danger" }
    }
    else {
      return "danger"
    }
  }

  if (!date) return null;

  return (
    <IonLabel color={calculateColor()} className='baggle-days-label'>
      {
        {
          1: remainingHours <= -6 ? "Yesterday" : `${-remainingHours} Hours Past`,
          2: remainingHours === 0 ? "Now!" : remainingHours > 0 ? `${remainingHours} Hours Left` : `${-remainingHours} Hours Past`,
          3: remainingHours >= 17 ? "Tomorrow" : `${remainingHours} Hours Left`,
          4: `${-remainingDays} Days Past`,
          5: remainingHours,
          6: `${remainingDays} Days Later`
        }[(Math.sign(remainingDays) + negToPosFix) + (Math.abs(remainingDays) > 1 ? numOverlapFix : numOverlapNoFix)]
      }
    </IonLabel>
  );
};




export default BaggleDaysLabel;