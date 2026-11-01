import { Box, ButtonBase, Typography } from "@mui/material";

export type SiteFooterProps = {
  year: number;
  onAdminClick?: () => void;
};

export const SiteFooter = (props: SiteFooterProps) => {
  const { year, onAdminClick } = props;
  return (
    <Box
      component="footer"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 1,
        borderTop: "1px solid",
        borderColor: "divider",
        pt: "24px",
        fontSize: 13,
        color: "text.secondary",
      }}
    >
      <Typography component="span" sx={{ fontSize: 13 }}>
        {`© ${year} nawa`}
      </Typography>
      <ButtonBase
        onClick={onAdminClick}
        sx={{ fontSize: 13, color: "text.secondary", minHeight: 44, px: 1 }}
      >
        管理者
      </ButtonBase>
    </Box>
  );
};

export default SiteFooter;
