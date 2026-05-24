import { Box, Button, Typography } from "@mui/material";

type HeaderProps = {
  onUpload: () => void;
};

export const Header = ({ onUpload }: HeaderProps) => (
  <Box className="trajectry-header" component="header">
    <Box className="trajectry-header__brand">
      <Typography className="trajectry-header__logo" component="div">
        trajec<Typography component="span">·</Typography>try
      </Typography>
      <Typography className="trajectry-header__subtitle hide-narrow" component="div">
        a year on the road
      </Typography>
    </Box>
    <Box className="trajectry-header__spacer" />
    <Typography className="trajectry-mono trajectry-header__stats hide-narrow" component="div">
      2026 · 12 routes · 487 km
    </Typography>
    <Button className="trajectry-header__upload" disableRipple type="button" onClick={onUpload}>
      + Upload GPX
    </Button>
    <Typography className="trajectry-header__avatar" component="div">
      あ
    </Typography>
  </Box>
);
