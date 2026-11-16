import { useState } from "react";
import { Box } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { ImagePanel } from "./ImagePanel";
import { listedActivities, trajectoryActivities } from "../../../domain/mockData";
import "../../page/TrajectoryPage.css";

const meta = {
  title: "Trajectory/Components/ImagePanel",
  component: ImagePanel,
  decorators: [
    (Story) => (
      <Box className="trajectory-page" sx={{ background: "#fff", height: 760, maxWidth: 360 }}>
        <Story />
      </Box>
    ),
  ],
  args: {
    here: 0.3,
    onPhotoSelect: fn(),
    onStartPlacing: fn(),
    onCancelPlacing: fn(),
    onDeletePhoto: fn(),
    onUploadFiles: fn(),
  },
} satisfies Meta<typeof ImagePanel>;

export default meta;
type Story = StoryObj<typeof meta>;

// 那須〜日光: one photo is placed (n1), the other has no position yet (n2).
const nasu = listedActivities[0];

const InteractiveImagePanel = () => {
  const activity = trajectoryActivities[1];
  const [activePhotoId, setActivePhotoId] = useState(activity.photos[0]?.id ?? null);
  const activePhoto = activity.photos.find((photo) => photo.id === activePhotoId);

  return (
    <ImagePanel
      activePhotoId={activePhotoId}
      activity={activity}
      here={activePhoto?.at ?? 0.52}
      onPhotoSelect={setActivePhotoId}
    />
  );
};

export const Default: Story = {
  args: { activity: trajectoryActivities[1], activePhotoId: null },
  render: () => <InteractiveImagePanel />,
};

// Everyone: only placed photos are listed, and nothing can be edited.
export const Viewer: Story = {
  args: { activity: nasu, activePhotoId: "n1" },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("1 枚")).toBeInTheDocument();
    await expect(canvas.getByText("25.8 km 地点")).toBeInTheDocument();
    await expect(canvas.queryByText("位置情報なし")).not.toBeInTheDocument();
    await expect(canvas.queryByRole("button", { name: "置き場所を選ぶ" })).not.toBeInTheDocument();
    await expect(canvas.queryByRole("button", { name: "写真を追加" })).not.toBeInTheDocument();
    await expect(canvas.queryByRole("button", { name: "写真を削除" })).not.toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: /写真（25\.8 km 地点）/ }));
    await expect(args.onPhotoSelect).toHaveBeenCalledWith("n1");
  },
};

// Admin: the photo without a position is listed with a button to choose where it goes.
export const Admin: Story = {
  args: { activity: nasu, activePhotoId: "n1", canEdit: true },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("2 枚")).toBeInTheDocument();
    await expect(canvas.getByText("位置情報なし")).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "置き場所を選ぶ" }));
    await expect(args.onStartPlacing).toHaveBeenCalledWith("n2");

    // The placed photo can be placed again once it is selected.
    await userEvent.click(canvas.getByRole("button", { name: "位置を置き直す" }));
    await expect(args.onStartPlacing).toHaveBeenCalledWith("n1");
  },
};

// The position of that photo is being chosen on the elevation chart.
export const Placing: Story = {
  args: { activity: nasu, activePhotoId: null, canEdit: true, placingPhotoId: "n2" },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /選択中/ }));
    await expect(args.onCancelPlacing).toHaveBeenCalled();
  },
};

export const Upload: Story = {
  args: { activity: nasu, activePhotoId: null, canEdit: true },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByTestId("photo-input");
    const photo = new File(["x"], "IMG_0001.jpg", { type: "image/jpeg" });
    const notAPhoto = new File(["x"], "notes.txt", { type: "text/plain" });

    // JST is selected at first; only images are sent.
    await expect(canvas.getByRole("button", { name: "JST" })).toHaveAttribute("aria-pressed", "true");
    await userEvent.upload(input, [photo, notAPhoto]);
    await expect(args.onUploadFiles).toHaveBeenLastCalledWith([photo], "JST");
  },
};

// The camera was set to UTC.
export const UploadWithUtcCamera: Story = {
  args: { activity: nasu, activePhotoId: null, canEdit: true },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const photo = new File(["x"], "IMG_0002.jpg", { type: "image/jpeg" });

    await userEvent.click(canvas.getByRole("button", { name: "UTC" }));
    await expect(canvas.getByRole("button", { name: "UTC" })).toHaveAttribute("aria-pressed", "true");
    await expect(canvas.getByRole("button", { name: "JST" })).toHaveAttribute("aria-pressed", "false");
    await userEvent.upload(canvas.getByTestId("photo-input"), photo);
    await expect(args.onUploadFiles).toHaveBeenLastCalledWith([photo], "UTC");

    // Clicking the selected one again does not leave nothing selected.
    await userEvent.click(canvas.getByRole("button", { name: "UTC" }));
    await expect(canvas.getByRole("button", { name: "UTC" })).toHaveAttribute("aria-pressed", "true");
  },
};

export const Uploading: Story = {
  args: { activity: nasu, activePhotoId: null, canEdit: true, uploadStatus: { uploading: true, failures: [] } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("アップロード中…")).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "写真を追加" })).toBeDisabled();
  },
};

export const UploadFailed: Story = {
  args: {
    activity: nasu,
    activePhotoId: null,
    canEdit: true,
    uploadStatus: { uploading: false, failures: [{ fileName: "IMG_0002.heic", reason: "unsupported image format" }] },
  },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("alert")).toHaveTextContent("IMG_0002.heic: unsupported image format");
  },
};

// Deleting takes two clicks so a photo is not lost by accident.
export const Delete: Story = {
  args: { activity: nasu, activePhotoId: null, canEdit: true },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const [first] = canvas.getAllByRole("button", { name: "写真を削除" });
    await userEvent.click(first);
    await expect(args.onDeletePhoto).not.toHaveBeenCalled();

    // The confirming button is red with white text. (The hover colour is a CSS :hover rule,
    // which simulated events cannot trigger: it is checked by hand in the browser.)
    const confirm = canvas.getByRole("button", { name: "本当に削除する" });
    await waitFor(() => expect(getComputedStyle(confirm).backgroundColor).toBe("rgb(211, 59, 59)"));
    await expect(getComputedStyle(confirm).color).toBe("rgb(255, 255, 255)");

    await userEvent.click(confirm);
    await expect(args.onDeletePhoto).toHaveBeenCalledTimes(1);
  },
};
