import { Box, Button, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import type { TrajectryActivity } from "../../../domain/types";

type ActivityCardProps = {
  activity: TrajectryActivity;
  active: boolean;
  onSelect: (activityId: string) => void;
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

export const ActivityCard = ({ activity, active, onSelect }: ActivityCardProps) => (
  <CardButton
    disableRipple
    type="button"
    onClick={() => onSelect(activity.id)}
    sx={{ border: active ? "2px solid var(--accent)" : "1px solid var(--rule)" }}
  >
    <Stack alignItems="center" direction="row" spacing={1}>
      <Dot style={{ background: activity.color }} />
      <CardTitle>{activity.title}</CardTitle>
      <ActivityDate>{activity.date}</ActivityDate>
    </Stack>
    <Stats direction="row" spacing={1.5}>
      <Typography component="span">{activity.km} km</Typography>
      <Typography component="span">+{activity.gain}m</Typography>
      <Typography component="span">{activity.duration}</Typography>
    </Stats>
  </CardButton>
);
