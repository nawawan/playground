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
    background: "rgba(0, 0, 0, 0.25)",
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
  borderRadius: 14,
  padding: "40px 20px",
  textAlign: "center",
  transition: "all 0.15s",
});

const BrowseButton = styled(Button)({
  background: "var(--accent)",
  borderRadius: 999,
  color: "#fff",
  cursor: "pointer",
  flexShrink: 0,
  fontSize: 13,
  fontWeight: 700,
  marginTop: 12,
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
  border: "1px solid var(--rule)",
  color: "var(--ink)",
});

const ImportButton = styled(ActionButton)({
  background: "var(--paper-2)",
  border: 0,
  color: "var(--ink-soft)",
  fontWeight: 700,
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
          borderRadius: "20px",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.2)",
          padding: "24px",
          width: "min(480px, calc(100vw - 32px))",
        },
      }}
    >
      <Heading>
        <Typography component="div" sx={{ color: "var(--ink)", fontSize: 22, fontWeight: 700, lineHeight: 1 }}>
          + new activity
        </Typography>
        <Typography component="div" sx={{ color: "var(--ink-soft)", fontSize: 13, mt: 0.75 }}>
          upload a GPX file from your bike computer or watch
        </Typography>
      </Heading>
      <Content>
        <DropZone
          alignItems="center"
          onDragLeave={() => setDragging(false)}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
          }}
          sx={{
            background: dragging ? "var(--paper)" : "var(--paper-2)",
            border: `1.5px dashed ${dragging ? "var(--accent)" : "var(--ink-faint)"}`,
          }}
        >
          <Typography component="div" sx={{ color: "var(--ink)", fontSize: 16, fontWeight: 700 }}>
            drop your .gpx here
          </Typography>
          <Typography component="div" sx={{ color: "var(--ink-soft)", fontSize: 13, mt: 1 }}>
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
