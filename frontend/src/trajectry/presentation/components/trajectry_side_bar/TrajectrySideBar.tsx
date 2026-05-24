import { Box, Button, Typography } from "@mui/material";
import type { TrajectryActivity } from "../../../domain/types";
import { ActivityCard } from "../activity_card/ActivityCard";

type TrajectrySideBarProps = {
  activities: TrajectryActivity[];
  activeId: string;
  onSelectActivity: (activityId: string) => void;
  onUpload: () => void;
};

export const TrajectrySideBar = ({
  activities,
  activeId,
  onSelectActivity,
  onUpload,
}: TrajectrySideBarProps) => (
  <Box className="trajectry-side-bar" component="aside">
    <Box className="trajectry-side-bar__head">
      <Typography className="trajectry-hand trajectry-side-bar__title" component="div">
        journal
      </Typography>
      <Typography className="trajectry-mono trajectry-side-bar__subtitle" component="div">
        a year of small adventures
      </Typography>
    </Box>
    <Box className="trajectry-side-bar__list">
      <Button className="trajectry-side-bar__new" disableRipple type="button" onClick={onUpload}>
        + new activity
      </Button>
      {activities.map((activity) => (
        <ActivityCard
          active={activity.id === activeId}
          activity={activity}
          key={activity.id}
          onSelect={onSelectActivity}
        />
      ))}
    </Box>
  </Box>
);
