import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';

import Sidebar from './Sidebar';

const meta = {
    title: "Sidebar",
    component: Sidebar,
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        years: ["2025年", "2024年", "2023年"],
        additionalYears: ["2022年", "2021年", "2020年"],
        onCkickHome: () => alert("ホームアイコンがクリックされました"),
        onClickGitHub: () => alert("GitHubアイコンがクリックされました"),
        onClickX: () => alert("Xアイコンがクリックされました"),
        onClickYear: (year: string) => action(`${year}がクリックされました`),
    }
}