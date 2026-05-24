import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import { useState } from "react";

type UploadModalProps = {
  open: boolean;
  onClose: () => void;
};

export const UploadModal = ({ open, onClose }: UploadModalProps) => {
  const [dragging, setDragging] = useState(false);

  if (!open) return null;

  return (
    <Dialog className="trajectry-upload-modal" open={open} onClose={onClose} PaperProps={{ className: "trajectry-upload-modal__card" }}>
      <DialogTitle className="trajectry-upload-modal__heading">
        <Typography className="trajectry-hand trajectry-upload-modal__title" component="div">
          + new activity
        </Typography>
        <Typography className="trajectry-mono trajectry-upload-modal__subtitle" component="div">
          upload a GPX file from your bike computer or watch
        </Typography>
      </DialogTitle>
      <DialogContent className="trajectry-upload-modal__content">
        <Stack
          alignItems="center"
          className={`trajectry-upload-modal__drop${dragging ? " is-dragging" : ""}`}
          onDragLeave={() => setDragging(false)}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
          }}
        >
          <Typography className="trajectry-upload-modal__pin" component="div">
            📍
          </Typography>
          <Typography className="trajectry-hand trajectry-upload-modal__drop-title" component="div">
            drop your .gpx here
          </Typography>
          <Typography className="trajectry-mono trajectry-upload-modal__or" component="div">
            or
          </Typography>
          <Button className="trajectry-upload-modal__browse" disableRipple type="button">
            browse files
          </Button>
        </Stack>
      </DialogContent>
      <DialogActions className="trajectry-upload-modal__actions">
        <Button className="trajectry-upload-modal__cancel" disableRipple onClick={onClose} type="button">
          cancel
        </Button>
        <Button className="trajectry-upload-modal__import" disabled disableRipple type="button">
          import
        </Button>
      </DialogActions>
    </Dialog>
  );
};
