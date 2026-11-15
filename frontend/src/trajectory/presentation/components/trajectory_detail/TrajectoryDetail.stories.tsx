import { Box } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { TrajectoryDetail } from "./TrajectoryDetail";
import { listedActivities, mockTravels, trajectoryActivities } from "../../../domain/mockData";
import { composeTravel } from "../../../domain/travel";

const meta = {
  title: "Trajectory/Components/TrajectoryDetail",
  component: TrajectoryDetail,
  decorators: [
    (Story) => (
      <Box sx={{ background: "#fff", maxWidth: 360 }}>
        <Story />
      </Box>
    ),
  ],
  args: { onChangeTravel: fn() },
} satisfies Meta<typeof TrajectoryDetail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    activity: trajectoryActivities[1],
  },
};

// 那須〜日光 (standalone), as the viewer sees it.
export const Viewer: Story = {
  args: { activity: listedActivities[0] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("那須〜日光")).toBeInTheDocument();
    await expect(canvas.getByText("2026.08.30")).toBeInTheDocument();
    await expect(canvas.getByText("86 km")).toBeInTheDocument();
    await expect(canvas.getByText("+969m")).toBeInTheDocument();
    await expect(canvas.getByText("307 min")).toBeInTheDocument();
    await expect(canvas.queryByText("所属する travel")).not.toBeInTheDocument();
  },
};

// Admin: the travel of the activity can be changed; "なし" detaches it.
export const Admin: Story = {
  args: { activity: listedActivities[0], travels: mockTravels, canEdit: true },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("combobox", { name: "所属する travel" }));
    // MUI renders the options in a portal.
    await userEvent.click(within(document.body).getByRole("option", { name: "戸隠" }));
    await expect(args.onChangeTravel).toHaveBeenCalledWith("a-nasu", "t-togakushi");
  },
};

export const AdminDetach: Story = {
  args: { activity: listedActivities[2], travels: mockTravels, canEdit: true },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("combobox", { name: "所属する travel" })).toHaveTextContent("戸隠");
    await userEvent.click(canvas.getByRole("combobox", { name: "所属する travel" }));
    await userEvent.click(within(document.body).getByRole("option", { name: "なし" }));
    await expect(args.onChangeTravel).toHaveBeenCalledWith("a-togakushi-1", null);
  },
};

// A travel selected in the sidebar: the days joined into one activity.
export const Travel: Story = {
  args: {
    activity: composeTravel(mockTravels[0], [listedActivities[2], listedActivities[3]]),
    endDate: listedActivities[3].date,
    // A travel is not edited here, even for the admin.
    canEdit: true,
    travels: mockTravels,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("戸隠")).toBeInTheDocument();
    await expect(canvas.getByText("TRAVEL")).toBeInTheDocument();
    await expect(canvas.getByText("05.10–05.11")).toBeInTheDocument();
    await expect(canvas.getByText("2 activities")).toBeInTheDocument();
    await expect(canvas.getByText("36 km")).toBeInTheDocument();
    await expect(canvas.getByText("+967m")).toBeInTheDocument();
    await expect(canvas.queryByText("所属する travel")).not.toBeInTheDocument();
  },
};
