"use client";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { useContext } from "react";

// => My Custom Hooks
import { useProfileFuncs } from "./useProfileFuncs";
import { useContactsFuncs } from "./useContactsFuncs";
import { useMessagesChatFuncs } from "./useMessagsChatFuncs";

// => Contexts
import { AlertDialogContext } from "@/contexts/AlertDialogContext";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces
import {
  DialogConfig,
  DialogInfo,
  Message,
  Friend,
  SectionConfig,
} from "@/lib/types";
import { Payload } from "@/Data";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface UseDialogReturn {
  handleDialog: (
    config: DialogInfo,
    sectionConfig: SectionConfig,
    payload?: Payload,
  ) => void;
}

export function useDialog(): UseDialogReturn {
  // ******************* Inside Hook  *******************
  // => Use Contexts
  const { handleIsOpenDialog, handleDialogConfig } =
    useContext(AlertDialogContext);

  // => Use Hooks
  const { dialoagCProfileFuncs } = useProfileFuncs();
  const { dialoagContactsFuncs } = useContactsFuncs();
  const { dialoagMessagesChatFuncs } = useMessagesChatFuncs();

  // => Functions
  const handleDialog = (
    config: DialogInfo,
    sectionConfig: SectionConfig,
    payload?: Payload,
  ) => {
    const newConfig: DialogConfig = {
      ...config,
      onCancel: () => {},
      onOk: () => {},
    };

    // Check Functions And Determine Section
    switch (sectionConfig.name) {
      // Case One --> In Settings Component <--
      case "profile":
        newConfig.onCancel = () => {
          dialoagCProfileFuncs[
            sectionConfig.funcName as keyof typeof dialoagCProfileFuncs
          ]("cancel");
        };

        newConfig.onOk = () => {
          dialoagCProfileFuncs[
            sectionConfig.funcName as keyof typeof dialoagCProfileFuncs
          ]("ok");
        };
        break;

      // Case Two --> In Contacts Component <--
      case "contacts":
        newConfig.onCancel = () => {
          dialoagContactsFuncs[
            sectionConfig.funcName as keyof typeof dialoagContactsFuncs
          ]("cancel");
        };

        newConfig.onOk = () => {
          dialoagContactsFuncs[
            sectionConfig.funcName as keyof typeof dialoagContactsFuncs
          ]("ok", payload as Friend);
        };
        break;

      // Case Three --> In User Chat Component <--
      case "messagesChat":
        newConfig.onCancel = () => {
          dialoagMessagesChatFuncs[
            sectionConfig.funcName as keyof typeof dialoagMessagesChatFuncs
          ]("cancel");
        };

        newConfig.onOk = () => {
          dialoagMessagesChatFuncs[
            sectionConfig.funcName as keyof typeof dialoagMessagesChatFuncs
          ]("ok", payload as Message);
        };
        break;

      // Default Case
      default:
        break;
    }

    // Send Alert Dialog Data To Context
    handleDialogConfig(newConfig);

    // Open Alert Dialog
    handleIsOpenDialog();
  };

  return { handleDialog };
}
