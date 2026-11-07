import { Box, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export type ThinningStats = {
  rawPoints: number;
  thinnedPoints: number;
  epsilon: number;
  maxDeviationMeters: number;
  meanDeviationMeters: number;
  maxTurnAngleDeg: number;
  rawBytes: number;
  thinnedBytes: number;
};

type ThinningPreviewProps = {
  stats: ThinningStats;
  map: React.ReactNode;
  height: React.ReactNode;
};

const Root = styled(Stack)({
  background: "var(--paper)",
  border: "1px solid var(--rule)",
  height: 720,
  width: "100%",
});

const StatsBar = styled(Stack)({
  borderBottom: "1px solid var(--rule)",
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 24,
  padding: "10px 14px",
});

const Caption = styled(Typography)({ color: "var(--ink-soft)", fontSize: 11 });
const Value = styled(Typography)({ fontFamily: "'Geist Mono', monospace", fontSize: 15 });

const formatBytes = (bytes: number) => (bytes >= 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${bytes} B`);

const Stat = ({ caption, value }: { caption: string; value: string }) => (
  <Stack>
    <Caption>{caption}</Caption>
    <Value>{value}</Value>
  </Stack>
);

export const ThinningPreview = ({ stats, map, height }: ThinningPreviewProps) => {
  const ratio = stats.rawPoints === 0 ? 0 : (stats.thinnedPoints / stats.rawPoints) * 100;
  return (
    <Root>
      <StatsBar>
        <Stat caption="points (thinned / raw)" value={`${stats.thinnedPoints} / ${stats.rawPoints}`} />
        <Stat caption="kept" value={`${ratio.toFixed(1)}%`} />
        <Stat caption="epsilon" value={`${stats.epsilon} m`} />
        <Stat caption="max deviation" value={`${stats.maxDeviationMeters.toFixed(1)} m`} />
        <Stat caption="mean deviation" value={`${stats.meanDeviationMeters.toFixed(2)} m`} />
        <Stat caption="max turn angle" value={`${stats.maxTurnAngleDeg.toFixed(0)}°`} />
        <Stat
          caption="payload (JSON, approx.)"
          value={`${formatBytes(stats.thinnedBytes)} / ${formatBytes(stats.rawBytes)}`}
        />
      </StatsBar>
      <Box sx={{ flex: 1, minHeight: 0 }}>{map}</Box>
      {height}
    </Root>
  );
};
