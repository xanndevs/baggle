import { useTranslation } from "react-i18next";
import { actionSheetController } from "@ionic/core";
import i18next from "i18next";

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
