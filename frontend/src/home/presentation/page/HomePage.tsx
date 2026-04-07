import { Box, Button, ButtonBase, Divider, Grid, Typography } from "@mui/material";

export type HomePageProps = {
  contents: {
    id: string;
    title: string;
    description: string;
  }[];
  onLoginClick?: () => void;
  onContentClick?: (id: string) => void;
};

export const HomePage = (props: HomePageProps) => {
  const { contents, onLoginClick, onContentClick } = props;
  return (
    <Box sx={{ 
      minHeight: "100vh",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4">nawa&apos;s page</Typography>
        <Button variant="outlined" onClick={onLoginClick}>
          ログイン
        </Button>
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5">Contents</Typography>
        <Divider sx={{ mt: 1 }} />
      </Box>
      <Grid container spacing={2}
      >
        {contents.map((content) => (
          <Grid size={6}>
          <ButtonBase
            key={content.id}
            onClick={() => onContentClick?.(content.id)}
            sx={{
              display: "block",
              width: "100%",
              textAlign: "left",
              bgcolor: "grey.300",
              px: 2,
              py: 2,
              borderRadius: 1,
            }}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              {content.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {content.description}
            </Typography>
          </ButtonBase>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default HomePage;
