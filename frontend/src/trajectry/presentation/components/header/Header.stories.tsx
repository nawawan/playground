import type { Meta, StoryObj } from "@storybook/react-vite";
import { Header } from "./Header";

const meta = {
  title: "Trajectry/Components/Header",
  component: Header,
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    canUpload: true,
    onUpload: () => undefined,
  },
};

export const ViewOnly: Story = {
  args: {
    canUpload: false,
    onUpload: () => undefined,
  },
};
