import { Button, Typography } from "@mui/material";

type ImageIconProps = {
  active?: boolean;
  className?: string;
  label?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
};

export const ImageIcon = ({ active = false, className = "", label = "Photo", onClick, style }: ImageIconProps) => (
  <Button
    aria-label={label}
    className={`trajectry-image-icon${active ? " is-active" : ""} ${className}`}
    disableRipple
    onClick={onClick}
    style={style}
    type="button"
  >
    <Typography component="span">📷</Typography>
  </Button>
);
