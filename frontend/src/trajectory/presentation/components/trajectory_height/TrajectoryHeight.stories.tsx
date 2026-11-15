import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { TrajectoryHeight } from "./TrajectoryHeight";
import { listedActivities, trajectoryActivities } from "../../../domain/mockData";

const meta = {
  title: "Trajectory/Components/TrajectoryHeight",
  component: TrajectoryHeight,
  args: {
    here: 0.5,
    onHereChange: fn(),
    onPhotoSelect: fn(),
    onPlacePhoto: fn(),
    onCancelPlacing: fn(),
  },
} satisfies Meta<typeof TrajectoryHeight>;

export default meta;
type Story = StoryObj<typeof meta>;

const InteractiveTrajectoryHeight = () => {
  const activity = trajectoryActivities[0];
  const [here, setHere] = useState(activity.photos[2]?.at ?? 0.5);
  const [activePhotoId, setActivePhotoId] = useState(activity.photos[2]?.id ?? null);

  const selectPhoto = (photoId: string) => {
    const photo = activity.photos.find((item) => item.id === photoId);
    setActivePhotoId(photoId);
    if (photo?.at != null) setHere(photo.at);
  };

  return (
    <TrajectoryHeight
      activePhotoId={activePhotoId}
      activity={activity}
      here={here}
      onHereChange={setHere}
      onPhotoSelect={selectPhoto}
    />
  );
};

export const Default: Story = {
  args: { activePhotoId: null, activity: trajectoryActivities[0] },
  render: () => <InteractiveTrajectoryHeight />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // One icon per photo, 4 photos.
    await expect(canvas.getAllByRole("button", { name: /^写真（/ })).toHaveLength(4);

    // Selecting an icon moves the cursor to that photo.
    await userEvent.click(canvas.getAllByRole("button", { name: /^写真（/ })[0]);
    await expect(canvas.getAllByRole("button", { name: /^写真（/ })[0]).toHaveClass("is-active");
  },
};

// 那須〜日光: the photo without a position has no icon on the chart.
export const UnplacedPhotoHasNoIcon: Story = {
  args: { activePhotoId: null, activity: listedActivities[0] },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getAllByRole("button", { name: /^写真（/ })).toHaveLength(1);
  },
};

export const Placing: Story = {
  args: { activePhotoId: null, activity: listedActivities[0], placingPhotoId: "n2" },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("写真を置く位置をクリックしてください")).toBeInTheDocument();

    // A click on the chart puts the photo there instead of moving the cursor.
    const chart = canvas.getByRole("application", { name: /choose a photo position/ });
    const rect = chart.getBoundingClientRect();
    await userEvent.pointer({
      keys: "[MouseLeft]",
      target: chart,
      coords: { clientX: rect.left + rect.width * 0.25, clientY: rect.top + rect.height / 2 },
    });
    await expect(args.onPlacePhoto).toHaveBeenCalledTimes(1);
    const [at] = (args.onPlacePhoto as ReturnType<typeof fn>).mock.calls[0];
    await expect(at).toBeCloseTo(0.25, 1);
    await expect(args.onHereChange).not.toHaveBeenCalled();

    await userEvent.click(canvas.getByRole("button", { name: "キャンセル" }));
    await expect(args.onCancelPlacing).toHaveBeenCalled();
  },
};
