import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export type EntryListProps = {
  sections: {
    id: string;
    heading: string;
    entries: {
      id: string;
      dateLabel: string;
      title: string;
      tagLabel?: string;
    }[];
  }[];
};

export const EntryList = (props: EntryListProps) => {
  const { sections } = props;
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "48px" }}>
      {sections.map((section) => (
        <Box component="section" key={section.id} id={section.id} sx={{ scrollMarginTop: 24 }}>
          <Typography
            component="h2"
            sx={{ fontSize: 14, fontWeight: 600, color: "text.secondary", mb: "8px" }}
          >
            {section.heading}
          </Typography>
          <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0 }}>
            {section.entries.map((entry) => (
              <Box component="li" key={entry.id}>
                <Box
                  component={Link}
                  to={`/blogs/${entry.id}`}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "56px minmax(0, 1fr)", sm: "64px minmax(0, 1fr) auto" },
                    columnGap: "20px",
                    alignItems: "baseline",
                    py: "14px",
                    color: "text.primary",
                    textDecoration: "none",
                    "&:hover .entry-title": { color: "primary.main" },
                  }}
                >
                  <Typography
                    component="span"
                    sx={{ fontSize: 14, color: "text.secondary", fontVariantNumeric: "tabular-nums" }}
                  >
                    {entry.dateLabel}
                  </Typography>
                  <Typography className="entry-title" component="span" sx={{ fontSize: 16, fontWeight: 500 }}>
                    {entry.title}
                  </Typography>
                  <Typography
                    component="span"
                    sx={{
                      fontSize: 12,
                      color: "text.secondary",
                      gridColumn: { xs: 2, sm: "auto" },
                    }}
                  >
                    {entry.tagLabel}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default EntryList;
