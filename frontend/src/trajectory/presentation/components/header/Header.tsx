import { Button, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

type HeaderProps = {
  canUpload: boolean;
  onUpload: () => void;
};

const HeaderRoot = styled(Stack)({
  background: "var(--paper)",
  borderBottom: "1px solid var(--rule)",
  flexShrink: 0,
  height: 56,
  minWidth: 0,
  padding: "0 20px",
});

const Logo = styled(Typography)({
  flexShrink: 0,
  fontSize: 20,
  fontWeight: 700,
  letterSpacing: -0.2,
  whiteSpace: "nowrap",
});

const Spacer = styled(Stack)({
  flex: 1,
  minWidth: 0,
});

const UploadButton = styled(Button)({
  background: "var(--accent)",
  borderRadius: 999,
  color: "#fff",
  cursor: "pointer",
  flexShrink: 0,
  fontSize: 13,
  fontWeight: 700,
  padding: "8px 16px",
  whiteSpace: "nowrap",
});

export const Header = ({ canUpload, onUpload }: HeaderProps) => (
  <HeaderRoot alignItems="center" direction="row" spacing={2}>
    <Logo>trajectory</Logo>
    <Spacer />
    {canUpload && (
      <UploadButton disableRipple type="button" onClick={onUpload}>
        + Upload GPX
      </UploadButton>
    )}
  </HeaderRoot>
);
