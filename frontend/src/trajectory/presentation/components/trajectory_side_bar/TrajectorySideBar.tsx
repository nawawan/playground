import { Button, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import type { TrajectoryActivity } from "../../../domain/types";
import { ActivityCard } from "../activity_card/ActivityCard";

type TrajectorySideBarProps = {
  activities: TrajectoryActivity[];
  activeId: string | null;
  canUpload: boolean;
  onSelectActivity: (activityId: string) => void;
  onUpload: () => void;
};

const SideBarRoot = styled(Stack)({
  background: "var(--paper-2)",
  borderRight: "1px solid var(--rule)",
  flexShrink: 0,
  overflow: "hidden",
  width: 260,
});

const SideBarHead = styled(Stack)({
  padding: "16px 16px 8px",
});

const SideBarTitle = styled(Typography)({
  color: "var(--ink)",
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: 0.6,
  textTransform: "uppercase",
});

const ActivityList = styled(Stack)({
  flex: 1,
  overflowY: "auto",
  padding: "8px 12px 16px",
});

const NewActivityButton = styled(Button)({
  background: "transparent",
  border: "1.5px dashed var(--ink-faint)",
  borderRadius: 10,
  color: "var(--ink-soft)",
  cursor: "pointer",
  fontSize: 14,
  fontWeight: 500,
  padding: "14px 12px",
});

export const TrajectorySideBar = ({
  activities,
  activeId,
  canUpload,
  onSelectActivity,
  onUpload,
}: TrajectorySideBarProps) => (
  <SideBarRoot>
    <SideBarHead>
      <SideBarTitle>ACTIVITIES</SideBarTitle>
    </SideBarHead>
    <ActivityList spacing={1}>
      {canUpload && (
        <NewActivityButton disableRipple type="button" onClick={onUpload}>
          + new activity
        </NewActivityButton>
      )}
      {activities.map((activity) => (
        <ActivityCard
          active={activity.id === activeId}
          activity={activity}
          key={activity.id}
          onSelect={onSelectActivity}
        />
      ))}
    </ActivityList>
  </SideBarRoot>
);
