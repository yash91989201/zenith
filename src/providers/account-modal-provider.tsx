"use client";
import { createContext } from "react";
// TYPES
import type React from "react";
import type { ReactNode } from "react";
// CUSTOM HOOKS
import { useToggle } from "@/hooks/use-toggle";

type AccountModalContextProps = {
  open: boolean;
  onOpenChange: () => void;
  openModal: () => void;
  closeModal: () => void;
};

export const AccountModalContext = createContext<
  AccountModalContextProps | undefined
>(undefined);

interface ModalProviderProps {
  children: ReactNode;
}

export const AccountModalProvider: React.FC<ModalProviderProps> = ({
  children,
}) => {
  const modal = useToggle(false);

  return (
    <AccountModalContext.Provider
      value={{
        open: modal.isOpen,
        onOpenChange: modal.toggle,
        openModal: modal.show,
        closeModal: modal.hide,
      }}
    >
      {children}
    </AccountModalContext.Provider>
  );
};
