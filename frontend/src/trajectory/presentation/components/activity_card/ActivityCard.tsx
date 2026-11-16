import { Box, Button, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { formatDuration, formatGain, formatKm, formatShortDate } from "../../../domain/format";
import type { TrajectoryActivity } from "../../../domain/types";

type ActivityCardProps = {
  activity: TrajectoryActivity;
  active: boolean;
  onSelect: (activityId: string) => void;
  // Inside a travel card: lighter, no year context needed.
  nested?: boolean;
};

const CardButton = styled(Button)({
  alignItems: "stretch",
  background: "var(--paper)",
  borderRadius: 10,
  color: "var(--ink)",
  cursor: "pointer",
  flexDirection: "column",
  gap: 4,
  padding: "10px 12px",
  textAlign: "left",
  transition: "border-color 0.12s",
  width: "100%",
});

const Dot = styled(Box)({
  borderRadius: "50%",
  flexShrink: 0,
  height: 8,
  width: 8,
});

const CardTitle = styled(Typography)({
  color: "var(--ink)",
  flex: 1,
  fontSize: 15,
  fontWeight: 700,
  lineHeight: 1,
  minWidth: 0,
});

const ActivityDate = styled(Typography)({
  color: "var(--ink-soft)",
  fontSize: 11,
});

const Stats = styled(Stack)({
  color: "var(--ink-soft)",
  fontSize: 12,
  marginTop: 2,
  paddingLeft: 16,
});

export const ActivityCard = ({ activity, active, onSelect, nested = false }: ActivityCardProps) => (
  <CardButton
    disableRipple
    type="button"
    onClick={() => onSelect(activity.id)}
    sx={{
      border: active ? "2px solid var(--accent)" : "1px solid var(--rule)",
      ...(nested ? { padding: "8px 10px" } : {}),
    }}
  >
    <Stack alignItems="center" direction="row" spacing={1}>
      <Dot style={{ background: activity.color }} />
      <CardTitle>{activity.title}</CardTitle>
      <ActivityDate>{formatShortDate(activity.date)}</ActivityDate>
    </Stack>
    <Stats direction="row" spacing={1.5}>
      <Typography component="span">{formatKm(activity.km)}</Typography>
      <Typography component="span">{formatGain(activity.gain)}</Typography>
      <Typography component="span">{formatDuration(activity.duration)}</Typography>
    </Stats>
  </CardButton>
);
