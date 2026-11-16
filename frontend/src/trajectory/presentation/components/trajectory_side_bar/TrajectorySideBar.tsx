import { Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import type { YearGroup } from "../../../domain/entries";
import { travelSelectionId } from "../../../domain/travel";
import { ALL_ACTIVITY_ID } from "../../../domain/types";
import { ActivityCard } from "../activity_card/ActivityCard";
import { AllActivityCard } from "../activity_card/AllActivityCard";
import { TravelCard } from "../activity_card/TravelCard";
import { YearHeader } from "../activity_card/YearHeader";

type TrajectorySideBarProps = {
  // Activities grouped by year, travels and standalone activities mixed (see buildYearGroups).
  groups: YearGroup[];
  // all activities, for the "All" card
  totalCount: number;
  // ALL_ACTIVITY_ID while the All card is selected; a travel's selection id while a travel is.
  activeId: string;
  // Admin: GPX upload and travel creation.
  canEdit: boolean;
  onSelectActivity: (activityId: string) => void;
  onSelectTravel: (travelId: string) => void;
  onUpload: () => void;
  onNewTravel: () => void;
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

const AdminButtons = styled(Stack)({
  flexDirection: "row",
  gap: 8,
});

const NewActivityButton = styled(Button)({
  flex: 1,
  background: "transparent",
  border: "1.5px dashed var(--ink-faint)",
  borderRadius: 10,
  color: "var(--ink-soft)",
  cursor: "pointer",
  fontSize: 14,
  fontWeight: 500,
  padding: "14px 12px",
});

const groupContainsActive = (group: YearGroup, activeId: string) =>
  group.entries.some((entry) =>
    entry.kind === "activity"
      ? entry.activity.id === activeId
      : travelSelectionId(entry.travel.id) === activeId || entry.children.some((child) => child.id === activeId),
  );

export const TrajectorySideBar = ({
  groups,
  totalCount,
  activeId,
  canEdit,
  onSelectActivity,
  onSelectTravel,
  onUpload,
  onNewTravel,
}: TrajectorySideBarProps) => {
  // Only the newest year (and the year of the selection) is open at first; a year the
  // user opened or closed by hand stays as they left it.
  const [overrides, setOverrides] = useState<Record<number, boolean>>({});

  return (
    <SideBarRoot>
      <SideBarHead>
        <SideBarTitle>Activities</SideBarTitle>
      </SideBarHead>
      <ActivityList spacing={1}>
        {canEdit && (
          <AdminButtons>
            <NewActivityButton disableRipple type="button" onClick={onUpload}>
              + new activity
            </NewActivityButton>
            <NewActivityButton disableRipple type="button" onClick={onNewTravel}>
              + new travel
            </NewActivityButton>
          </AdminButtons>
        )}
        <AllActivityCard
          active={activeId === ALL_ACTIVITY_ID}
          count={totalCount}
          onSelect={() => onSelectActivity(ALL_ACTIVITY_ID)}
        />
        {groups.map((group, index) => {
          const open = overrides[group.year] ?? (index === 0 || groupContainsActive(group, activeId));
          return (
            <Stack key={group.year} spacing={1}>
              <YearHeader
                activityCount={group.activityCount}
                distance={group.distance}
                onToggle={() => setOverrides((prev) => ({ ...prev, [group.year]: !open }))}
                open={open}
                year={group.year}
              />
              {open &&
                group.entries.map((entry) =>
                  entry.kind === "activity" ? (
                    <ActivityCard
                      active={entry.activity.id === activeId}
                      activity={entry.activity}
                      key={`activity-${entry.activity.id}`}
                      onSelect={onSelectActivity}
                    />
                  ) : (
                    <TravelCard
                      activeId={activeId}
                      entry={entry}
                      key={`travel-${entry.travel.id}`}
                      onSelectActivity={onSelectActivity}
                      onSelectTravel={onSelectTravel}
                    />
                  ),
                )}
            </Stack>
          );
        })}
      </ActivityList>
    </SideBarRoot>
  );
};
