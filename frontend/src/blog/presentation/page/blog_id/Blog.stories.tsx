import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';

import Blog  from './Blog';
import * as SidebarStories from "../../Sidebar/Sidebar.stories";
import Sidebar from '../../Sidebar/Sidebar';

const meta = {
    title : "Blog",
    component: Blog,
    decorators: [(Story) => <MemoryRouter><Story /></MemoryRouter>],
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