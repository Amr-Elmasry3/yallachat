"use client";

// ************************ Ui Imports *************************
// => Ready To Use Components
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/shadcn/alert-dialog";

// => My Custom Components
import MyButton from "../common/MyButton";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { useContext } from "react";

// => Contexts
import { AlertDialogContext } from "@/contexts/AlertDialogContext";

function MyAlertDialog() {
  // ******************* Inside The Component  *******************
  // => Use Contexts
  const { dialogConfig, isOpen, handleIsOpenDialog } =
    useContext(AlertDialogContext);

  return (
    <div className="my-alert-dialog">
      <AlertDialog open={isOpen}>
        <AlertDialogContent className="bg-white dark:bg-gray-dark border-none">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-light-text dark:text-dark-text">
              {dialogConfig.title}
            </AlertDialogTitle>

            <AlertDialogDescription className="text-light-description dark:text-dark-description">
              {dialogConfig.description}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <div
              className="alert-dialog-cancel"
              onClick={() => {
                dialogConfig.onCancel();

                handleIsOpenDialog();
              }}
            >
              <MyButton
                type="button"
                btnTitle={dialogConfig.cancelBtn}
                style="danger"
              />
            </div>

            <div
              className="alert-dialog-action"
              onClick={() => {
                dialogConfig.onOk();

                handleIsOpenDialog();
              }}
            >
              <MyButton
                type="button"
                btnTitle={dialogConfig.okBtn}
                style="one"
              />
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default MyAlertDialog;
