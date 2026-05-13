"use client";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { createContext, useState } from "react";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces
import { DialogConfig } from "@/lib/types";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface AlertDialogProps {
  children: React.ReactNode;
}
type Context = {
  dialogConfig: DialogConfig;
  isOpen: boolean;
  handleIsOpenDialog: () => void;
  handleDialogConfig: (config: DialogConfig) => void;
};

// => Variables
export const AlertDialogContext = createContext<Context>({
  dialogConfig: {
    title: "",
    description: "",
    cancelBtn: "",
    okBtn: "",
    onCancel: () => {},
    onOk: () => {},
  },
  isOpen: false,
  handleIsOpenDialog: (): void => {},
  handleDialogConfig: () => {},
});

function AlertDialogProvider({ children }: AlertDialogProps) {
  // ******************* Inside The Component  *******************
  // => States & Refs
  const [dialogConfig, setDialogConfig] = useState<DialogConfig>({
    title: "",
    description: "",
    cancelBtn: "",
    okBtn: "",
    onCancel: () => {},
    onOk: () => {},
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // => Functions
  const handleIsOpenDialog = (): void => {
    setIsOpen(!isOpen);
  };

  const handleDialogConfig = (config: DialogConfig): void => {
    setDialogConfig(config);
  };

  return (
    <AlertDialogContext
      value={{
        dialogConfig: dialogConfig,
        isOpen: isOpen,
        handleDialogConfig: handleDialogConfig,
        handleIsOpenDialog: handleIsOpenDialog,
      }}
    >
      {children}
    </AlertDialogContext>
  );
}

export default AlertDialogProvider;
