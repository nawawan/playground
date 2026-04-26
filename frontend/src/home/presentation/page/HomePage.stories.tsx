import type { Meta, StoryObj } from "@storybook/react-vite";

import HomePage from "./HomePage";
import { Default as LoginDialogStries } from "../../../presentation/widgets/LoginDialog/LoginDialog.stories";
import { LoginDialog } from "../../../presentation/widgets/LoginDialog/LoginDialog";

const meta = {
  title: "HomePage",
  component: HomePage,
} satisfies Meta<typeof HomePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    contents: [
      { id: "1", title: "ブログ", description: "ブログの内容" },
      { id: "2", title: "Maze Creator", description: "迷路作成するやつ" },
    ],
    LoginDialog: <LoginDialog {...LoginDialogStries.args} />,
  },
};
