import { MenuItem, Select, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { formatDate, formatDuration, formatGain, formatKm, formatPeriod } from "../../../domain/format";
import type { TrajectoryActivity, Travel } from "../../../domain/types";

type TrajectoryDetailProps = {
  // The activity, or a travel joined into one (it has `segments`, one per activity).
  activity: TrajectoryActivity;
  travels?: Travel[];
  // Admin on a single activity: the travel it belongs to can be changed.
  canEdit?: boolean;
  onChangeTravel?: (activityId: string, travelId: string | null) => void;
  // Disables the select while a change is being saved.
  busy?: boolean;
  // Last day of a travel (for the period).
  endDate?: string;
};

const NO_TRAVEL = "";

const DetailRoot = styled(Stack)({
  borderBottom: "1px solid var(--rule)",
  padding: "20px 24px 16px",
});

const Title = styled(Typography)({
  color: "var(--ink)",
  fontSize: 24,
  fontWeight: 700,
  lineHeight: 1.2,
});

const Tag = styled("span")({
  background: "#e6efff",
  borderRadius: 999,
  color: "#2b5fd9",
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: 0.6,
  marginLeft: 8,
  padding: "2px 8px",
  verticalAlign: "middle",
});

const Stats = styled(Stack)({
  color: "var(--ink-soft)",
  flexWrap: "wrap",
  fontSize: 13,
  gap: 8,
  marginTop: 8,
});

export const TrajectoryDetail = ({
  activity,
  travels = [],
  canEdit = false,
  onChangeTravel,
  busy = false,
  endDate,
}: TrajectoryDetailProps) => {
  const isTravel = activity.segments !== undefined;
  const when = isTravel && endDate ? formatPeriod(activity.date, endDate) : formatDate(activity.date);

  return (
    <DetailRoot>
      <Title>
        {activity.title}
        {isTravel && <Tag>TRAVEL</Tag>}
      </Title>
      {canEdit && !isTravel && (
        <Stack alignItems="center" direction="row" spacing={1} sx={{ marginTop: 1 }}>
          <Typography component="label" htmlFor="activity-travel" sx={{ color: "var(--ink-soft)", fontSize: 12 }}>
            所属する travel
          </Typography>
          <Select
            disabled={busy}
            displayEmpty
            id="activity-travel"
            inputProps={{ "aria-label": "所属する travel" }}
            onChange={(event) => onChangeTravel?.(activity.id, event.target.value === NO_TRAVEL ? null : event.target.value)}
            size="small"
            sx={{ fontSize: 13, "& .MuiSelect-select": { padding: "4px 12px" } }}
            value={travels.some((travel) => travel.id === activity.travelId) ? (activity.travelId ?? NO_TRAVEL) : NO_TRAVEL}
          >
            <MenuItem value={NO_TRAVEL}>なし</MenuItem>
            {travels.map((travel) => (
              <MenuItem key={travel.id} value={travel.id}>
                {travel.name}
              </MenuItem>
            ))}
          </Select>
        </Stack>
      )}
      <Stats direction="row" flexWrap="wrap">
        <Typography component="span">{when}</Typography>
        {isTravel && (
          <>
            <Typography component="span">·</Typography>
            <Typography component="span">{activity.segments?.length} activities</Typography>
          </>
        )}
        <Typography component="span">·</Typography>
        <Typography component="span">{formatKm(activity.km)}</Typography>
        <Typography component="span">·</Typography>
        <Typography component="span">{formatGain(activity.gain)}</Typography>
        <Typography component="span">·</Typography>
        <Typography component="span">{formatDuration(activity.duration)}</Typography>
      </Stats>
    </DetailRoot>
  );
};
