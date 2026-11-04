import type { Meta, StoryObj } from "@storybook/react-vite";

import SiteFooter from "./SiteFooter";

const meta = {
  title: "SiteFooter",
  component: SiteFooter,
} satisfies Meta<typeof SiteFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { year: 2026 },
};
