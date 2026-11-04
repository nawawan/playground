import { Box, Skeleton, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { AVATAR_PLACEHOLDER_COLOR, BUTTON_BORDER_COLOR, TAG_BACKGROUND_COLOR } from "../../../presentation/theme/theme";

export type HomePageProps = {
  profile: {
    name: string;
    affiliation: string;
    bio: string;
    avatarUrl?: string;
    githubUrl: string;
    xUrl: string;
  };
  contents: {
    id: string;
    title: string;
    description: string;
    to: string;
  }[];
  // undefined = 非表示（取得失敗）
  latestPosts?: {
    id: string;
    title: string;
    publishedAtLabel?: string;
    tag?: string;
  }[];
  isLatestPostsLoading?: boolean;
  footer: ReactNode;
};

const linkSx = { color: "inherit", textDecoration: "none" } as const;

const pillSx = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: 44,
  px: "18px",
  border: `1px solid ${BUTTON_BORDER_COLOR}`,
  borderRadius: "999px",
  fontSize: 14,
  fontWeight: 500,
  color: "text.primary",
  textDecoration: "none",
  "&:hover": { borderColor: "primary.main", color: "primary.main" },
} as const;

export const HomePage = (props: HomePageProps) => {
  const { profile, contents, latestPosts, isLatestPostsLoading, footer } = props;
  return (
    <Box
      sx={{
        maxWidth: 1120,
        mx: "auto",
        pt: "80px",
        px: "24px",
        pb: "48px",
        display: "flex",
        flexWrap: "wrap",
        gap: "64px",
        boxSizing: "border-box",
      }}
    >
      <Box
        component="section"
        aria-label="プロフィール"
        sx={{ flex: "1 1 280px", maxWidth: 340, display: "flex", flexDirection: "column", gap: "24px" }}
      >
        {profile.avatarUrl ? (
          <Box
            component="img"
            src={profile.avatarUrl}
            alt=""
            sx={{ width: 112, height: 112, borderRadius: "50%", objectFit: "cover" }}
          />
        ) : (
          <Box aria-hidden sx={{ width: 112, height: 112, borderRadius: "50%", bgcolor: AVATAR_PLACEHOLDER_COLOR }} />
        )}
        <Box>
          <Typography component="h1" sx={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
            {profile.name}
          </Typography>
          <Typography sx={{ mt: "6px", fontSize: 14, color: "text.secondary" }}>
            {profile.affiliation}
          </Typography>
        </Box>
        <Typography sx={{ fontSize: 15, lineHeight: 1.9 }}>{profile.bio}</Typography>
        <Box sx={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <Box component="a" href={profile.githubUrl} target="_blank" rel="noopener noreferrer" sx={pillSx}>
            GitHub
          </Box>
          <Box component="a" href={profile.xUrl} target="_blank" rel="noopener noreferrer" sx={pillSx}>
            X
          </Box>
        </Box>
      </Box>

      <Box sx={{ flex: "999 1 560px", minWidth: 0, display: "flex", flexDirection: "column", gap: "56px" }}>
        <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <Typography component="h2" sx={{ fontSize: 20, fontWeight: 600 }}>
            Contents
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))",
              gap: "20px",
            }}
          >
            {contents.map((content) => (
              <Box
                key={content.id}
                component={Link}
                to={content.to}
                sx={{
                  ...linkSx,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  p: "24px",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: "12px",
                  "&:hover": { borderColor: "primary.main" },
                }}
              >
                <Box>
                  <Typography sx={{ fontSize: 17, fontWeight: 600 }}>{content.title}</Typography>
                  <Typography sx={{ mt: "6px", fontSize: 14, color: "text.secondary" }}>
                    {content.description}
                  </Typography>
                </Box>
                <Box component="span" aria-hidden sx={{ fontSize: 18, color: "primary.main" }}>
                  →
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {(isLatestPostsLoading || latestPosts) && (
          <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <Typography component="h2" sx={{ fontSize: 20, fontWeight: 600 }}>
                最新の記事
              </Typography>
              <Box
                component={Link}
                to="/blogs"
                sx={{ ...linkSx, fontSize: 14, fontWeight: 500, color: "primary.main" }}
              >
                すべて見る →
              </Box>
            </Box>
            <Box
              component="ul"
              sx={{
                listStyle: "none",
                m: 0,
                p: 0,
                borderTop: "1px solid",
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              {isLatestPostsLoading
                ? [0, 1].map((i) => (
                    <Box component="li" key={i} sx={{ py: "18px", px: "4px" }}>
                      <Skeleton width="60%" height={24} />
                      <Skeleton width={90} height={20} />
                    </Box>
                  ))
                : latestPosts?.map((post, index) => (
                    <Box
                      component="li"
                      key={post.id}
                      sx={{ borderTop: index === 0 ? "none" : "1px solid", borderColor: "divider" }}
                    >
                      <Box
                        component={Link}
                        to={`/blogs/${post.id}`}
                        sx={{
                          ...linkSx,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 2,
                          py: "18px",
                          px: "4px",
                        }}
                      >
                        <Box sx={{ minWidth: 0 }}>
                          <Typography sx={{ fontSize: 16, fontWeight: 500 }}>{post.title}</Typography>
                          {post.publishedAtLabel && (
                            <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                              {post.publishedAtLabel}
                            </Typography>
                          )}
                        </Box>
                        {post.tag && (
                          <Box
                            component="span"
                            sx={{
                              flexShrink: 0,
                              fontSize: 12,
                              fontWeight: 600,
                              letterSpacing: ".06em",
                              bgcolor: TAG_BACKGROUND_COLOR,
                              color: "primary.main",
                              px: "10px",
                              py: "4px",
                              borderRadius: "999px",
                            }}
                          >
                            {post.tag}
                          </Box>
                        )}
                      </Box>
                    </Box>
                  ))}
            </Box>
          </Box>
        )}
      </Box>

      <Box sx={{ flexBasis: "100%" }}>{footer}</Box>
    </Box>
  );
};

export default HomePage;
