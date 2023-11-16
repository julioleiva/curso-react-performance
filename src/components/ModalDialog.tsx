import { Button } from "./Button";


type ModalDialogProps = {
  onClose: () => void;
};

export const ModalDialog = ({ onClose }: ModalDialogProps) => {
  return (
    <div className="modal-dialog">
      <div className="content">modal content</div>
      <div className="footer">
        <Button onClick={onClose}>close dialog</Button>
      </div>
    </div>
  );
};
