import type { Meta, StoryObj } from "@storybook/react-vite";

import HomePage from "./HomePage";
import SiteFooter from "../../../presentation/widgets/SiteFooter/SiteFooter";

const meta = {
  title: "HomePage",
  component: HomePage,
  args: {
    profile: {
      name: "nawa",
      affiliation: "Software Engineer / Tokyo",
      bio: "自己紹介文のダミーです。",
      githubUrl: "https://github.com/nawawan",
      xUrl: "https://x.com/nawawan_kpr",
    },
    contents: [
      { id: "maze", title: "Maze Creator", description: "迷路作成するやつ", to: "/maze" },
      { id: "blogs", title: "ブログ", description: "日々の出来事をつらつらと", to: "/blogs" },
    ],
    footer: <SiteFooter year={2026} />,
  },
} satisfies Meta<typeof HomePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    latestPosts: [
      { id: "1", title: "タグ付きの記事", publishedAtLabel: "2026-07-31", tag: "TECH" },
      { id: "2", title: "タグ無しの記事", publishedAtLabel: "2026-07-28" },
      { id: "3", title: "去年の記事", publishedAtLabel: "2025-05-10", tag: "TRAVEL" },
    ],
  },
};

export const Loading: Story = {
  args: { isLatestPostsLoading: true },
};

export const FetchFailed: Story = {
  args: { latestPosts: undefined },
};
