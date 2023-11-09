import React from "react";
import { useResizeDetector } from "./useResizeDetector";

export const useModalDialog = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    // Ni siquiera lo usamos, sólo lo invocamos pero su estado ya nos afecta
    useResizeDetector();
  
    return {
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    };
  };