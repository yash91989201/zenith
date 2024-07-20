"use client";
import { useState } from "react";

export function useToggle(initialValue = false) {
  const [state, setState] = useState(initialValue);

  const isOpen = state == true;
  const open = () => setState(true);
  const close = () => setState(false);
  const toggle = () => setState(!state);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}
