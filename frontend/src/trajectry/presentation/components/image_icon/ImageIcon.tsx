type ImageIconProps = {
  active?: boolean;
  className?: string;
  label?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
};

export const ImageIcon = ({ active = false, className = "", label = "Photo", onClick, style }: ImageIconProps) => (
  <button
    aria-label={label}
    className={`trajectry-image-icon${active ? " is-active" : ""} ${className}`}
    onClick={onClick}
    style={style}
    type="button"
  >
    <span>📷</span>
  </button>
);
