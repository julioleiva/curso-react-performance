import React from "react";
import { Button } from "./button";
import { ModalDialog } from "./basic-modal-dialog";


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