import type { Meta, StoryObj } from "@storybook/react-vite";

import AdminProfile from "./AdminProfile";

const meta = {
  title: "AdminProfile",
  component: AdminProfile,
} satisfies Meta<typeof AdminProfile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    values: { thumbnail: "", summary: "自己紹介と経歴のダミーです。\n2行目。", place: "Tokyo" },
  },
};

export const Empty: Story = {
  args: { values: { thumbnail: "", summary: "", place: "" } },
};

export const Saving: Story = {
  args: { ...Default.args, isSaving: true },
};

export const Saved: Story = {
  args: { ...Default.args, notice: { type: "success", message: "保存しました" } },
};

export const SaveFailed: Story = {
  args: { ...Default.args, notice: { type: "error", message: "保存に失敗しました" } },
};
