import React from "react";
import { Button } from "./Button";
import { ModalDialog } from "./ModalDialog";


export const ButtonWithModalDialog = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    // renderizar solo Button y ModalDialog aquí
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>
          Abrir diálogo
        </Button>
        {isOpen ? (
          <ModalDialog onClose={() => setIsOpen(false)} />
        ) : null}
      </>
    );
  };