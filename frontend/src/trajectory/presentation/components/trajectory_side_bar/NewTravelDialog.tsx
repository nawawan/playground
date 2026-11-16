import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import { useState } from "react";

export type NewTravelDialogProps = {
  open: boolean;
  onClose: () => void;
  // Rejects when the travel could not be created.
  onCreate: (name: string) => Promise<void>;
};

export const NewTravelDialog = ({ open, onClose, onCreate }: NewTravelDialogProps) => {
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const trimmed = name.trim();

  const close = () => {
    setName("");
    setFailed(false);
    onClose();
  };

  const create = async () => {
    if (!trimmed || busy) return;
    setBusy(true);
    setFailed(false);
    try {
      await onCreate(trimmed);
      close();
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog className="trajectory-upload-modal" fullWidth maxWidth="xs" onClose={close} open={open}>
      <DialogTitle>新しい travel</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          label="travel の名前"
          margin="dense"
          onChange={(event) => setName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") void create();
          }}
          slotProps={{ htmlInput: { maxLength: 100 } }}
          value={name}
        />
        <Typography sx={{ color: "var(--ink-soft)", fontSize: 12, marginTop: 1 }}>
          作成後、activity の「所属する travel」から追加します。activity が無い travel は一覧に表示されません。
        </Typography>
        {failed && (
          <Typography role="alert" sx={{ color: "var(--pin)", fontSize: 13, marginTop: 1 }}>
            作成に失敗しました。もう一度お試しください。
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button disabled={busy} onClick={close} type="button">
          キャンセル
        </Button>
        <Button disabled={!trimmed || busy} onClick={() => void create()} type="button" variant="contained">
          作成
        </Button>
      </DialogActions>
    </Dialog>
  );
};
