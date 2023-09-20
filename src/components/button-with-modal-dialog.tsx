import { Button } from "./button";
import { ModalDialog } from "./basic-modal-dialog";
import { useModalDialog } from "../hooks/useModalDialog";


export const ButtonWithModalDialog = () => {
  const { isOpen, open, close } = useModalDialog();

  // renderiza sólo Button y ModalDialog
  return (
    <>
      <Button onClick={open}>Open dialog</Button>
      {isOpen ? <ModalDialog onClose={close} /> : null}
    </>
  );
};