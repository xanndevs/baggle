import { useTranslation } from "react-i18next";
import { actionSheetController } from "@ionic/core";
import i18next from "i18next";
import { bagAddOutline, bagOutline, checkmark, checkmarkCircle, checkmarkDoneOutline, checkmarkOutline } from "ionicons/icons";


export function presentDeleteConfirmation(): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    actionSheetController
      .create({
        header: i18next.t("generic.deleteConfirmationText") as string,
        buttons: [
          {
            text: i18next.t("generic.delete") as string,
            role: "destructive",
            handler: () => resolve(true),
          },
          {
            text: i18next.t("generic.cancel") as string,
            role: "cancel",
            handler: () => resolve(false),
          },
        ],
      })
      .then((actionSheet) => {
        actionSheet.present();
      });
  });
}

export function presentReadyOrPackedSelection(): Promise<ItemStatus | undefined> {
  return new Promise<ItemStatus | undefined>((resolve) => {
    actionSheetController
      .create({
        header: i18next.t("items.actionSheet.checkUserActionTitle") as string,
        buttons: [
          {
            icon: checkmarkOutline,
            text: i18next.t("items.actionSheet.asReady") as string,
            handler: () => resolve("ready"),
          },
          {
            icon: checkmarkDoneOutline,
            text: i18next.t("items.actionSheet.asPacked") as string,
            handler: () => resolve("packed"),
          },
          {
            text: i18next.t("generic.cancel") as string,
            role: "cancel",
            handler: () => resolve(undefined),
          },
        ],
      })
      .then((actionSheet) => {
        actionSheet.present();
      });
  });
}
