import { Button } from './button';

type BasicModalDialogProps = {
  onClose: () => void;
};

export const ModalDialog = ({ onClose }: BasicModalDialogProps) => {
  return (
    <div className="modal-dialog">
      <div className="content">modal content</div>
      <div className="footer">
        <Button onClick={onClose}>close dialog</Button>
      </div>
    </div>
  );
};
