import { Button, Stack, Typography } from "@mui/material";
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
  border: "1px solid var(--rule)",
  borderRadius: 8,
  color: "inherit",
  cursor: "pointer",
  flexDirection: "column",
  gap: 4,
  padding: "10px 12px",
  textAlign: "left",
  transition: "background 0.12s, border-color 0.12s, transform 0.12s",
  width: "100%",
  "&:hover": {
    borderColor: "var(--rule-strong)",
    transform: "translateY(-1px)",
  },
  "&.is-active": {
    background: "#fff5e9",
    border: "1.5px solid var(--trace)",
    boxShadow: "0 1px 0 rgba(178, 90, 22, 0.1)",
  },
});

const CardTitle = styled(Typography)({
  color: "var(--ink)",
  flex: 1,
  fontSize: 18,
  fontWeight: 700,
  lineHeight: 1,
  minWidth: 0,
});

const ActivityDate = styled(Typography)({
  color: "var(--ink-soft)",
  fontSize: 10,
});

const Subtitle = styled(Typography)({
  color: "var(--ink-soft)",
  fontSize: 12,
  paddingLeft: 22,
});

const Stats = styled(Stack)({
  color: "var(--ink-2)",
  fontSize: 11,
  marginTop: 2,
  paddingLeft: 22,
});

export const ActivityCard = ({ activity, active, onSelect }: ActivityCardProps) => (
  <CardButton
    className={active ? "is-active" : ""}
    disableRipple
    type="button"
    onClick={() => onSelect(activity.id)}
  >
    <Stack alignItems="center" direction="row" spacing={1}>
      <Typography component="span" sx={{ fontSize: 14 }}>
        {activity.type === "bike" ? "🚴" : "🏃"}
      </Typography>
      <CardTitle>
        {activity.title}
      </CardTitle>
      <ActivityDate className="trajectry-mono">
        {activity.date}
      </ActivityDate>
    </Stack>
    <Subtitle>
      {activity.subtitle}
    </Subtitle>
    <Stats className="trajectry-mono" direction="row" spacing={1.5}>
      <Typography component="span">{activity.km} km</Typography>
      <Typography component="span">↑ {activity.gain}m</Typography>
      <Typography component="span">{activity.duration}</Typography>
    </Stats>
  </CardButton>
);
