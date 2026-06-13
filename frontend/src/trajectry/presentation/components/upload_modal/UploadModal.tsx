import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";

type UploadModalProps = {
  open: boolean;
  onClose: () => void;
};

const StyledDialog = styled(Dialog)({
  backdropFilter: "blur(2px)",
  "& .MuiBackdrop-root": {
    background: "rgba(42, 38, 34, 0.4)",
  },
});

const Heading = styled(DialogTitle)({
  padding: 0,
});

const Content = styled(DialogContent)({
  marginTop: 18,
  overflow: "visible",
  padding: 0,
});

const DropZone = styled(Stack)({
  background: "var(--paper-2)",
  border: "2px dashed var(--rule-strong)",
  borderRadius: 10,
  padding: "40px 20px",
  textAlign: "center",
  transition: "all 0.15s",
  "&.is-dragging": {
    background: "#fff5e9",
    borderColor: "var(--trace)",
  },
});

const BrowseButton = styled(Button)({
  background: "var(--trace)",
  border: "1px solid var(--trace-2)",
  borderRadius: 999,
  boxShadow: "0 1px 0 rgba(255, 255, 255, 0.3) inset, 0 2px 4px rgba(178, 90, 22, 0.25)",
  color: "#fff",
  cursor: "pointer",
  flexShrink: 0,
  fontSize: 13,
  fontWeight: 700,
  marginTop: 8,
  padding: "8px 16px",
  whiteSpace: "nowrap",
});

const Actions = styled(DialogActions)({
  justifyContent: "flex-end",
  marginTop: 18,
  padding: 0,
});

const ActionButton = styled(Button)({
  borderRadius: 999,
  cursor: "pointer",
  fontSize: 13,
  padding: "8px 16px",
});

const CancelButton = styled(ActionButton)({
  background: "transparent",
  border: "1px solid var(--rule-strong)",
});

const ImportButton = styled(ActionButton)({
  background: "var(--ink-faint)",
  border: 0,
  color: "#fff",
  fontWeight: 700,
  opacity: 0.5,
});

export const UploadModal = ({ open, onClose }: UploadModalProps) => {
  const [dragging, setDragging] = useState(false);

  if (!open) return null;

  return (
    <StyledDialog
      className="trajectry-upload-modal"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          background: "var(--paper)",
          border: "1px solid var(--rule-strong)",
          borderRadius: "12px",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.25)",
          padding: "24px",
          width: "min(480px, calc(100vw - 32px))",
        },
      }}
    >
      <Heading>
        <Typography className="trajectry-hand" component="div" sx={{ fontSize: 28, lineHeight: 1 }}>
          + new activity
        </Typography>
        <Typography className="trajectry-mono" component="div" sx={{ color: "var(--ink-soft)", fontSize: 11, mt: 0.5 }}>
          upload a GPX file from your bike computer or watch
        </Typography>
      </Heading>
      <Content>
        <DropZone
          alignItems="center"
          className={dragging ? "is-dragging" : ""}
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
          <Typography component="div" sx={{ fontSize: 38 }}>
            📍
          </Typography>
          <Typography className="trajectry-hand" component="div" sx={{ fontSize: 22, mt: 0.75 }}>
            drop your .gpx here
          </Typography>
          <Typography className="trajectry-mono" component="div" sx={{ color: "var(--ink-soft)", fontSize: 11, mt: 0.75 }}>
            or
          </Typography>
          <BrowseButton disableRipple type="button">
            browse files
          </BrowseButton>
        </DropZone>
      </Content>
      <Actions>
        <CancelButton disableRipple onClick={onClose} type="button">
          cancel
        </CancelButton>
        <ImportButton disabled disableRipple type="button">
          import
        </ImportButton>
      </Actions>
    </StyledDialog>
  );
};
