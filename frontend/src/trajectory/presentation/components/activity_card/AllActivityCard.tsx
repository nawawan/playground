import { Button, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

type AllActivityCardProps = {
  active: boolean;
  count: number;
  onSelect: () => void;
};

const CardButton = styled(Button)({
  alignItems: "stretch",
  background: "var(--paper)",
  borderRadius: 10,
  cursor: "pointer",
  flexDirection: "column",
  gap: 4,
  padding: "10px 12px",
  textAlign: "left",
  transition: "border-color 0.12s",
  width: "100%",
});

const CardTitle = styled(Typography)({
  color: "var(--ink)",
  fontSize: 15,
  fontWeight: 700,
  lineHeight: 1,
});

const Caption = styled(Typography)({
  color: "var(--ink-soft)",
  fontSize: 12,
});

export const AllActivityCard = ({ active, count, onSelect }: AllActivityCardProps) => (
  <CardButton
    aria-pressed={active}
    disableRipple
    type="button"
    onClick={onSelect}
    sx={{ border: active ? "2px solid var(--accent)" : "1px solid var(--rule)" }}
  >
    <Stack spacing={0.5}>
      <CardTitle>All</CardTitle>
      <Caption>{count} activities on one map</Caption>
    </Stack>
  </CardButton>
);
