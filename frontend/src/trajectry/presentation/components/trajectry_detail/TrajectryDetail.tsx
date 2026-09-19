import { Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import type { TrajectryActivity } from "../../../domain/types";

type TrajectryDetailProps = {
  activity: TrajectryActivity;
};

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

const Stats = styled(Stack)({
  color: "var(--ink-soft)",
  flexWrap: "wrap",
  fontSize: 13,
  gap: 8,
  marginTop: 8,
});

export const TrajectryDetail = ({ activity }: TrajectryDetailProps) => (
  <DetailRoot>
    <Title>{activity.title}</Title>
    <Stats direction="row" flexWrap="wrap">
      <Typography component="span">{activity.date}</Typography>
      <Typography component="span">·</Typography>
      <Typography component="span">{activity.km}km</Typography>
      <Typography component="span">·</Typography>
      <Typography component="span">+{activity.gain}m</Typography>
      <Typography component="span">·</Typography>
      <Typography component="span">{activity.duration}</Typography>
    </Stats>
  </DetailRoot>
);
