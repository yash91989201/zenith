import { use } from "react";
// CONTEXT
import { AccountModalContext } from "@/providers/account-modal-provider";

export function useAccountModal() {
  const context = use(AccountModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};