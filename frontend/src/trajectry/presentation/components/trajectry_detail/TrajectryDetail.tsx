import { Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import type { TrajectryActivity } from "../../../domain/types";

type TrajectryDetailProps = {
  activity: TrajectryActivity;
};

const DetailRoot = styled(Stack)({
  borderBottom: "1px solid var(--rule)",
  padding: "28px 38px 26px",
});

const Title = styled(Typography)({
  fontSize: 29,
  fontWeight: 900,
  lineHeight: 1.2,
});

const Subtitle = styled(Typography)({
  display: "none",
});

const Stats = styled(Stack)({
  color: "var(--ink-soft)",
  flexWrap: "wrap",
  fontSize: 18,
  fontWeight: 600,
  gap: 16,
  marginTop: 12,
});

export const TrajectryDetail = ({ activity }: TrajectryDetailProps) => (
  <DetailRoot>
    <Title className="trajectry-hand">
      {activity.title}
    </Title>
    <Subtitle>
      {activity.subtitle}
    </Subtitle>
    <Stats className="trajectry-mono" direction="row" flexWrap="wrap">
      <Typography component="span">{activity.date}</Typography>
      <Typography component="span">·</Typography>
      <Typography component="span">{activity.km}km</Typography>
      <Typography component="span">·</Typography>
      <Typography component="span">↑{activity.gain}m</Typography>
      <Typography component="span">·</Typography>
      <Typography component="span">{activity.duration}</Typography>
    </Stats>
  </DetailRoot>
);
