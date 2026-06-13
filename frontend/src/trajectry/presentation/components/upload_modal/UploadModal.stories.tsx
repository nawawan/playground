import type { Meta, StoryObj } from "@storybook/react-vite";
import { UploadModal } from "./UploadModal";

const meta = {
  title: "Trajectry/Components/UploadModal",
  component: UploadModal,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof UploadModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    open: true,
    onClose: () => undefined,
  },
};
