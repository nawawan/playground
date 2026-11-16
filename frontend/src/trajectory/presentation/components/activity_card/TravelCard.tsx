import { Box, Button, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import type { SidebarEntry } from "../../../domain/entries";
import { formatGain, formatKm, formatPeriod } from "../../../domain/format";
import { travelSelectionId } from "../../../domain/travel";
import { ActivityCard } from "./ActivityCard";

type TravelEntry = Extract<SidebarEntry, { kind: "travel" }>;

type TravelCardProps = {
  entry: TravelEntry;
  activeId: string;
  onSelectTravel: (travelId: string) => void;
  onSelectActivity: (activityId: string) => void;
};

const Root = styled(Box)({
  background: "var(--paper-2)",
  borderRadius: 10,
  overflow: "hidden",
});

const Head = styled(Stack)({
  alignItems: "flex-start",
  flexDirection: "row",
});

const SelectButton = styled(Button)({
  alignItems: "stretch",
  borderRadius: 0,
  color: "var(--ink)",
  cursor: "pointer",
  flex: 1,
  flexDirection: "column",
  gap: 4,
  minWidth: 0,
  padding: "10px 12px 10px 4px",
  textAlign: "left",
});

const ToggleButton = styled(Button)({
  color: "var(--ink-soft)",
  fontSize: 11,
  height: 40,
  padding: 0,
  width: 28,
});

const Tag = styled("span")({
  background: "#e6efff",
  borderRadius: 999,
  color: "#2b5fd9",
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: 0.6,
  padding: "2px 8px",
});

const Children = styled(Stack)({
  borderTop: "1px solid var(--rule)",
  padding: "8px 8px 10px",
});

export const TravelCard = ({ entry, activeId, onSelectTravel, onSelectActivity }: TravelCardProps) => {
  const { travel, children, summary } = entry;
  const selectionId = travelSelectionId(travel.id);
  const selected = activeId === selectionId;
  const containsActive = selected || children.some((child) => child.id === activeId);
  // null: follow the selection; set once the user opens or closes it by hand.
  const [override, setOverride] = useState<boolean | null>(null);
  const expanded = override ?? containsActive;

  return (
    <Root sx={{ border: selected ? "2px solid var(--accent)" : "1px solid var(--rule)" }}>
      <Head>
        <ToggleButton
          aria-expanded={expanded}
          aria-label={expanded ? `${travel.name} を折りたたむ` : `${travel.name} を展開`}
          disableRipple
          onClick={() => setOverride(!expanded)}
          type="button"
        >
          {expanded ? "▾" : "▸"}
        </ToggleButton>
        <SelectButton aria-pressed={selected} disableRipple onClick={() => onSelectTravel(travel.id)} type="button">
          <Stack alignItems="center" direction="row" spacing={1}>
            <Typography sx={{ color: "var(--ink)", flex: 1, fontSize: 15, fontWeight: 700, lineHeight: 1.2, minWidth: 0 }}>
              {travel.name}
            </Typography>
            <Tag>TRAVEL</Tag>
          </Stack>
          <Stack direction="row" flexWrap="wrap" spacing={1.5} sx={{ color: "var(--ink-soft)", fontSize: 12 }}>
            <Typography component="span">{formatPeriod(summary.startDate, summary.endDate)}</Typography>
            <Typography component="span">{summary.count} activities</Typography>
            <Typography component="span">{formatKm(summary.distance)}</Typography>
            <Typography component="span">{formatGain(summary.gain)}</Typography>
          </Stack>
        </SelectButton>
      </Head>
      {expanded && (
        <Children spacing={1}>
          {children.map((child) => (
            <ActivityCard active={child.id === activeId} activity={child} key={child.id} nested onSelect={onSelectActivity} />
          ))}
        </Children>
      )}
    </Root>
  );
};
