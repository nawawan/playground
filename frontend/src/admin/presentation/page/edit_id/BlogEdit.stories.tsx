import type { Meta, StoryObj } from "@storybook/react-vite";
import BlogEdit from "./BlogEdit";

import { Default as MarkdownEditorDefault }from "../../../../presentation/widgets/MarkdownEditor/MarkdownEditor.stories";
import MarkdownEditor from "../../../../presentation/widgets/MarkdownEditor/MarkdownEditor";

const meta = {
  title: 'BlogEdit',
  component: BlogEdit,
} satisfies Meta<typeof BlogEdit>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    Editor: <MarkdownEditor {...MarkdownEditorDefault.args} />
  },
};
