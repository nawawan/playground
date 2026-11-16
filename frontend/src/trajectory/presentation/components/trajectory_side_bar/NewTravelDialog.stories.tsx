import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { NewTravelDialog } from "./NewTravelDialog";

const meta = {
  title: "Trajectory/Components/NewTravelDialog",
  component: NewTravelDialog,
  args: { open: true, onClose: fn(), onCreate: fn(async () => undefined) },
} satisfies Meta<typeof NewTravelDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

// The dialog is rendered in a portal, outside the story canvas.
const dialog = () => within(document.body);

export const Default: Story = {
  play: async ({ args }) => {
    // Nothing to create without a name.
    await expect(dialog().getByRole("button", { name: "作成" })).toBeDisabled();

    await userEvent.type(dialog().getByRole("textbox", { name: "travel の名前" }), "  戸隠  ");
    await userEvent.click(dialog().getByRole("button", { name: "作成" }));
    await expect(args.onCreate).toHaveBeenCalledWith("戸隠");
    await expect(args.onClose).toHaveBeenCalled();
  },
};

export const Failed: Story = {
  args: {
    onCreate: fn(async () => {
      throw new Error("boom");
    }),
  },
  play: async ({ args }) => {
    await userEvent.type(dialog().getByRole("textbox", { name: "travel の名前" }), "戸隠");
    await userEvent.click(dialog().getByRole("button", { name: "作成" }));
    // The dialog stays open so the name is not lost.
    await expect(await dialog().findByRole("alert")).toHaveTextContent("作成に失敗しました");
    await expect(args.onClose).not.toHaveBeenCalled();
  },
};

export const Cancel: Story = {
  play: async ({ args }) => {
    await userEvent.click(dialog().getByRole("button", { name: "キャンセル" }));
    await expect(args.onClose).toHaveBeenCalled();
    await expect(args.onCreate).not.toHaveBeenCalled();
  },
};
