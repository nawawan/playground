import { Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { formatKm } from "../../../domain/format";

type YearHeaderProps = {
  year: number;
  open: boolean;
  activityCount: number;
  // meters
  distance: number;
  onToggle: () => void;
};

const Root = styled(Button)({
  alignItems: "center",
  borderBottom: "1px solid var(--rule)",
  borderRadius: 0,
  color: "var(--ink)",
  cursor: "pointer",
  gap: 8,
  justifyContent: "flex-start",
  padding: "12px 4px",
  width: "100%",
});

export const YearHeader = ({ year, open, activityCount, distance, onToggle }: YearHeaderProps) => (
  <Root aria-expanded={open} disableRipple onClick={onToggle} type="button">
    <Typography component="span" sx={{ color: "var(--ink-soft)", fontSize: 10 }}>
      {open ? "▾" : "▸"}
    </Typography>
    <Typography component="span" sx={{ color: "var(--ink)", fontSize: 16, fontWeight: 700 }}>
      {year}
    </Typography>
    <Typography component="span" sx={{ color: "var(--ink-soft)", fontSize: 12, marginLeft: "auto" }}>
      {activityCount} activities · {formatKm(distance)}
    </Typography>
  </Root>
);
