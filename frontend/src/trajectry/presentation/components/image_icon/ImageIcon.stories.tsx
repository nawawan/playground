import { Box } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ImageIcon } from "./ImageIcon";

const meta = {
  title: "Trajectry/Components/ImageIcon",
  component: ImageIcon,
  decorators: [
    (Story) => (
      <Box sx={{ height: 120, position: "relative", width: 160 }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof ImageIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    active: false,
    label: "Photo marker",
    onClick: () => undefined,
    style: { left: "50%", top: "80%" },
  },
};

export const Active: Story = {
  args: {
    ...Default.args,
    active: true,
  },
};
