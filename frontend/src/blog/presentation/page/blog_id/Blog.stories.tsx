import type { Meta, StoryObj } from '@storybook/react-vite';

import Blog  from './Blog';
import * as SidebarStories from "../../Sidebar/Sidebar.stories";
import Sidebar from '../../Sidebar/Sidebar';

const meta = {
    title : "Blog",
    component: Blog,
} satisfies Meta<typeof Blog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args:{
        title: "My Blog",
        content: <p>本文</p>,
        sidebar: <Sidebar {...SidebarStories.Default.args} />,
    }
}