import { Box, ButtonBase, LinearProgress, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export type BlogTopProps = {
  tabs: { value: string; label: string }[];
  selectedTag: string;
  onTagFilterChange?: (tag: string) => void;
  years: { year: string; href: string }[];
  isFetching?: boolean;
  githubUrl: string;
  xUrl: string;
  entryList: ReactNode;
  footer: ReactNode;
};

const externalLinkSx = { color: "text.secondary", textDecoration: "none", fontSize: 14 } as const;

export const BlogTop = (props: BlogTopProps) => {
  const { tabs, selectedTag, onTagFilterChange, years, isFetching, githubUrl, xUrl, entryList, footer } = props;
  return (
    <Box
      sx={{
        maxWidth: 800,
        mx: "auto",
        px: "24px",
        py: "48px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: "48px",
      }}
    >
      <Box
        component="nav"
        aria-label="サイト"
        sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1 }}
      >
        <Box
          component={Link}
          to="/"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            minHeight: 44,
            fontSize: 14,
            fontWeight: 600,
            color: "text.primary",
            textDecoration: "none",
          }}
        >
          ← home
        </Box>
        <Box sx={{ display: "flex", gap: "20px" }}>
          <Box component="a" href={githubUrl} target="_blank" rel="noopener noreferrer" sx={externalLinkSx}>
            GitHub
          </Box>
          <Box component="a" href={xUrl} target="_blank" rel="noopener noreferrer" sx={externalLinkSx}>
            X
          </Box>
        </Box>
      </Box>

      <Box>
        <Typography component="h1" sx={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
          Blog
        </Typography>
        <Typography sx={{ mt: "8px", fontSize: 15, color: "text.secondary" }}>
          日々の出来事をつらつらと
        </Typography>
      </Box>

      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            columnGap: 3,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box component="nav" aria-label="カテゴリ" sx={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
            {tabs.map((tab) => {
              const selected = tab.value === selectedTag;
              return (
                <ButtonBase
                  key={tab.value}
                  onClick={() => onTagFilterChange?.(tab.value)}
                  aria-current={selected ? "page" : undefined}
                  sx={{
                    py: "10px",
                    fontSize: 14,
                    fontWeight: 500,
                    color: selected ? "text.primary" : "text.secondary",
                    borderBottom: "2px solid",
                    borderColor: selected ? "text.primary" : "transparent",
                    mb: "-1px",
                  }}
                >
                  {tab.label}
                </ButtonBase>
              );
            })}
          </Box>
          <Box component="nav" aria-label="年" sx={{ display: "flex", flexWrap: "wrap", gap: "16px", py: "10px" }}>
            {years.map((y) => (
              <Box
                key={y.year}
                component="a"
                href={y.href}
                sx={{ fontSize: 13, color: "primary.main", textDecoration: "none" }}
              >
                {y.year}
              </Box>
            ))}
          </Box>
        </Box>
        {isFetching && <LinearProgress />}
      </Box>

      {entryList}
      {footer}
    </Box>
  );
};

export default BlogTop;
