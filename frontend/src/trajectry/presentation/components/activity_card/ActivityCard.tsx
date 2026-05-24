import { Box, Button, Typography } from "@mui/material";
import type { TrajectryActivity } from "../../../domain/types";

type ActivityCardProps = {
  activity: TrajectryActivity;
  active: boolean;
  onSelect: (activityId: string) => void;
};

export const ActivityCard = ({ activity, active, onSelect }: ActivityCardProps) => (
  <Button
    className={`trajectry-activity-card${active ? " is-active" : ""}`}
    disableRipple
    type="button"
    onClick={() => onSelect(activity.id)}
  >
    <Box className="trajectry-activity-card__top">
      <Typography className="trajectry-activity-card__icon" component="span">
        {activity.type === "bike" ? "🚴" : "🏃"}
      </Typography>
      <Typography className="trajectry-activity-card__title" component="span">
        {activity.title}
      </Typography>
      <Typography className="trajectry-mono trajectry-activity-card__date" component="span">
        {activity.date}
      </Typography>
    </Box>
    <Typography className="trajectry-activity-card__subtitle" component="div">
      {activity.subtitle}
    </Typography>
    <Box className="trajectry-mono trajectry-activity-card__stats">
      <Typography component="span">{activity.km} km</Typography>
      <Typography component="span">↑ {activity.gain}m</Typography>
      <Typography component="span">{activity.duration}</Typography>
    </Box>
  </Button>
);
