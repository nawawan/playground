import type { Meta, StoryObj } from "@storybook/react-vite";

import Reveal from "./Reveal";

const meta = {
  title: "Primitive/Reveal",
  component: Reveal,
} satisfies Meta<typeof Reveal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <div>スクロールすると表示されます</div>,
  },
  render: (args) => (
    <div>
      <div style={{ height: "120vh" }} />
      <Reveal {...args} />
    </div>
  ),
};
