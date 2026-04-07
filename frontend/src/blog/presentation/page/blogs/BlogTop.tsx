import {
  Box,
  Container,
  Divider,
  Paper,
  Stack,
  Grid,
  Typography,
} from "@mui/material";
import type { ReactNode } from "react";

export type BlogTopProps = {
  blogEntries: ReactNode,
  sidebar: ReactNode
}

export const BlogTop = (props: BlogTopProps) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(180deg, #f4f4f4 0%, #ededed 100%)",
        px: 2,
      }}
    >
      <Container>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 6 },
            border: "1px solid",
            borderColor: "grey.100",
          }}
        >
          <Stack spacing={3}>
            <Box textAlign="center">
              <Typography variant="h4" fontWeight={600}>
                nawa&apos;s blog
              </Typography>
              <Divider sx={{ mt: 2 }} />
            </Box>

            <Grid 
              container
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 200px" },
                gap: { xs: 3, md: 4 },
              }}
            >
              {props.blogEntries}
              {props.sidebar}
            </Grid>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}

export default BlogTop;
