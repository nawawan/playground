import type { Meta, StoryObj } from '@storybook/react-vite';

import BlogTop from './BlogTop';
import EntryList from "../../EntryList/EntryList";
import * as EntryListStories from "../../EntryList/EntryList.stories";
import SiteFooter from "../../../../presentation/widgets/SiteFooter/SiteFooter";

const meta = {
    title: "BlogTop",
    component: BlogTop,
    args: {
        tabs: [
            { value: "", label: "すべて" },
            { value: "TRAVEL", label: "Travel" },
            { value: "RETROSPECTIVE", label: "Retrospective" },
            { value: "DIARY", label: "Diary" },
            { value: "TECH", label: "Tech" },
        ],
        selectedTag: "",
        years: [
            { year: "2026", href: "#y2026" },
            { year: "2025", href: "#y2025" },
        ],
        githubUrl: "https://github.com/nawawan",
        xUrl: "https://x.com/nawawan_kpr",
        entryList: <EntryList {...EntryListStories.Default.args} />,
        footer: <SiteFooter year={2026} />,
    },
} satisfies Meta<typeof BlogTop>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TechSelected: Story = {
    args: { selectedTag: "TECH" },
};

export const FetchingNextTag: Story = {
    args: { selectedTag: "TRAVEL", isFetching: true },
};
