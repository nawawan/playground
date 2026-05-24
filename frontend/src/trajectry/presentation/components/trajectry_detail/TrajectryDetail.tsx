import { Box, Typography } from "@mui/material";
import type { TrajectryActivity } from "../../../domain/types";

type TrajectryDetailProps = {
  activity: TrajectryActivity;
};

export const TrajectryDetail = ({ activity }: TrajectryDetailProps) => (
  <Box className="trajectry-detail">
    <Typography className="trajectry-hand trajectry-detail__title" component="div">
      {activity.title}
    </Typography>
    <Typography className="trajectry-detail__subtitle" component="div">
      {activity.subtitle}
    </Typography>
    <Box className="trajectry-mono trajectry-detail__stats">
      <Typography component="span">{activity.date}</Typography>
      <Typography component="span">·</Typography>
      <Typography component="span">{activity.km}km</Typography>
      <Typography component="span">·</Typography>
      <Typography component="span">↑{activity.gain}m</Typography>
      <Typography component="span">·</Typography>
      <Typography component="span">{activity.duration}</Typography>
    </Box>
  </Box>
);
