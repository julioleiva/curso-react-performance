import React from "react";
import { useResizeDetector } from "./useResizeDetector";

export const useModalDialog = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    // I don't even use it, just call it here
    useResizeDetector();
  
    return {
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    };
  };