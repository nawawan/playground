import { Button, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

type HeaderProps = {
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

const Brand = styled(Stack)({
  flexShrink: 0,
});

const Logo = styled(Typography)({
  fontFamily: '"Zen Kaku Gothic New", sans-serif',
  fontSize: 30,
  fontWeight: 900,
  letterSpacing: 0.3,
  lineHeight: 1,
  whiteSpace: "nowrap",
  "& span": {
    color: "var(--trace)",
  },
});

const Subtitle = styled(Typography)({
  color: "var(--ink-soft)",
  fontSize: 13,
  whiteSpace: "nowrap",
});

const Spacer = styled(Stack)({
  flex: 1,
  minWidth: 0,
});

const HeaderStats = styled(Typography)({
  color: "var(--ink-soft)",
  fontSize: 11,
  letterSpacing: 0.5,
  whiteSpace: "nowrap",
});

const UploadButton = styled(Button)({
  background: "var(--trace)",
  border: "1px solid var(--trace-2)",
  borderRadius: 999,
  boxShadow: "0 1px 0 rgba(255, 255, 255, 0.3) inset, 0 2px 4px rgba(178, 90, 22, 0.25)",
  color: "#fff",
  cursor: "pointer",
  flexShrink: 0,
  fontSize: 13,
  fontWeight: 700,
  padding: "8px 16px",
  whiteSpace: "nowrap",
});

const Avatar = styled(Typography)({
  alignItems: "center",
  background: "var(--paper-2)",
  border: "1px solid var(--rule-strong)",
  borderRadius: "50%",
  display: "flex",
  flexShrink: 0,
  fontSize: 18,
  fontWeight: 700,
  height: 36,
  justifyContent: "center",
  width: 36,
});

export const Header = ({ onUpload }: HeaderProps) => (
  <HeaderRoot alignItems="center" direction="row" spacing={2}>
    <Brand alignItems="baseline" direction="row" spacing={1.5}>
      <Logo>
        trajec<Typography component="span">·</Typography>try
      </Logo>
      <Subtitle className="hide-narrow">
        a year on the road
      </Subtitle>
    </Brand>
    <Spacer />
    <HeaderStats className="trajectry-mono hide-narrow">
      2026 · 12 routes · 487 km
    </HeaderStats>
    <UploadButton disableRipple type="button" onClick={onUpload}>
      + Upload GPX
    </UploadButton>
    <Avatar>
      あ
    </Avatar>
  </HeaderRoot>
);
