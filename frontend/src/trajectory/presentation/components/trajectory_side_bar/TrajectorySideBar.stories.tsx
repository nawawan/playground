import { useMemo, useState } from "react";
import { Box } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { TrajectorySideBar } from "./TrajectorySideBar";
import { buildYearGroups } from "../../../domain/entries";
import { listedActivities, mockTravels } from "../../../domain/mockData";
import { travelSelectionId } from "../../../domain/travel";

const groups = buildYearGroups(listedActivities, mockTravels);

const meta = {
  title: "Trajectory/Components/TrajectorySideBar",
  component: TrajectorySideBar,
  decorators: [
    (Story) => (
      <Box sx={{ height: 760 }}>
        <Story />
      </Box>
    ),
  ],
  args: {
    groups,
    totalCount: listedActivities.length,
    activeId: "a-nasu",
    canEdit: false,
    onSelectActivity: fn(),
    onSelectTravel: fn(),
    onUpload: fn(),
    onNewTravel: fn(),
  },
} satisfies Meta<typeof TrajectorySideBar>;

export default meta;
type Story = StoryObj<typeof meta>;

const InteractiveSideBar = ({ canEdit }: { canEdit: boolean }) => {
  const [activeId, setActiveId] = useState("a-nasu");
  const sidebarGroups = useMemo(() => buildYearGroups(listedActivities, mockTravels), []);

  return (
    <TrajectorySideBar
      activeId={activeId}
      canEdit={canEdit}
      groups={sidebarGroups}
      onNewTravel={() => undefined}
      onSelectActivity={setActiveId}
      onSelectTravel={(travelId) => setActiveId(travelSelectionId(travelId))}
      onUpload={() => undefined}
      totalCount={listedActivities.length}
    />
  );
};

export const Viewer: Story = {
  render: () => <InteractiveSideBar canEdit={false} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole("button", { name: "+ new travel" })).not.toBeInTheDocument();
    await expect(canvas.queryByRole("button", { name: "+ new activity" })).not.toBeInTheDocument();

    // Years, newest first; the newest year is open, the older one is closed.
    await expect(canvas.getByRole("button", { name: /2026/ })).toHaveAttribute("aria-expanded", "true");
    await expect(canvas.getByRole("button", { name: /2025/ })).toHaveAttribute("aria-expanded", "false");
    await expect(canvas.queryByText("富士山一周")).not.toBeInTheDocument();

    // The year header counts the activities (the travel's two included), not the travel.
    await expect(canvas.getByRole("button", { name: /2026/ })).toHaveTextContent("5 activities · 209 km");

    // Standalone activities and the travel are mixed in one list, newest first.
    await expect(canvas.getByText("那須〜日光")).toBeInTheDocument();
    await expect(canvas.getByText("TRAVEL")).toBeInTheDocument();
    // A travel without activities is not listed.
    await expect(canvas.queryByText("まだ空の travel")).not.toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: /2025/ }));
    await expect(canvas.getByText("富士山一周")).toBeInTheDocument();
  },
};

export const TravelExpandsToItsActivities: Story = {
  render: () => <InteractiveSideBar canEdit={false} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Collapsed at first: its activities are not listed.
    await expect(canvas.queryByText("戸隠ヒルクラ")).not.toBeInTheDocument();
    await expect(canvas.getByText("05.10–05.11")).toBeInTheDocument();
    await expect(canvas.getByText("2 activities")).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "戸隠 を展開" }));
    await expect(canvas.getByText("戸隠ヒルクラ")).toBeInTheDocument();
    await expect(canvas.getByText("戸隠ダウンヒル（失敗）")).toBeInTheDocument();

    // Selecting the travel does not hide its activities; selecting one of them selects only it.
    await userEvent.click(canvas.getByRole("button", { name: /戸隠ヒルクラ/ }));
    await expect(canvas.getByRole("button", { name: /戸隠ヒルクラ/ })).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: /戸隠 TRAVEL/ })).toHaveAttribute("aria-pressed", "false");
  },
};

export const TravelSelected: Story = {
  args: { activeId: travelSelectionId("t-togakushi") },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    // The selected travel is open and marked as selected.
    await expect(canvas.getByRole("button", { name: /戸隠 TRAVEL/ })).toHaveAttribute("aria-pressed", "true");
    await expect(canvas.getByText("戸隠ヒルクラ")).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: /戸隠 TRAVEL/ }));
    await expect(args.onSelectTravel).toHaveBeenCalledWith("t-togakushi");
  },
};

export const Admin: Story = {
  args: { canEdit: true },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "+ new travel" }));
    await expect(args.onNewTravel).toHaveBeenCalled();
    await userEvent.click(canvas.getByRole("button", { name: "+ new activity" }));
    await expect(args.onUpload).toHaveBeenCalled();
  },
};

export const Empty: Story = {
  args: { groups: [], totalCount: 0, canEdit: true },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText("0 activities on one map")).toBeInTheDocument();
  },
};
