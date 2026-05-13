"use client";

// *********************** Logic Imports ***********************
// => My Custom Hooks
import { useProfileFuncs } from "./useProfileFuncs";
import { useContactsFuncs } from "./useContactsFuncs";
import { useMessagesChatFuncs } from "./useMessagsChatFuncs";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces
import { Friend, Message, SectionConfig } from "@/lib/types";
import { Payload } from "@/Data";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface UseNonDialogReturn {
  handleNonDialog: (sectionConfig: SectionConfig, payload?: Payload) => void;
}

export function useNonDialog(): UseNonDialogReturn {
  // ******************* Inside The Component  *******************
  // => Use Hooks
  const { nonDialogProfileFunc } = useProfileFuncs();
  const { nonDialogContactsFunc } = useContactsFuncs();
  const { nonDialogMessagesChatFunc } = useMessagesChatFuncs();

  // => Functions
  const handleNonDialog = (sectionConfig: SectionConfig, payload?: Payload) => {
    // Check Functions And Determine Section
    switch (sectionConfig.name) {
      // Case One --> Settings Component <--
      case "profile":
        nonDialogProfileFunc[
          sectionConfig.funcName as keyof typeof nonDialogProfileFunc
        ]();
        break;

      // Case Two --> Contacts Component <--
      case "contacts":
        nonDialogContactsFunc[
          sectionConfig.funcName as keyof typeof nonDialogContactsFunc
        ](payload as Friend);
        break;

      // Case Three --> In User Chat Component <--
      case "messagesChat":
        nonDialogMessagesChatFunc[
          sectionConfig.funcName as keyof typeof nonDialogMessagesChatFunc
        ](payload as Message);
        break;

      // Default Case
      default:
        break;
    }
  };

  return { handleNonDialog };
}
