import type { Meta, StoryObj } from "@storybook/react-vite";

import EntryList from "./EntryList";

const meta = {
  title: "EntryList",
  component: EntryList,
} satisfies Meta<typeof EntryList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    sections: [
      {
        id: "y2026",
        heading: "2026",
        entries: [
          { id: "1", dateLabel: "07.31", title: "タグ付きの記事", tagLabel: "Tech" },
          { id: "2", dateLabel: "07.28", title: "タグ無しの記事" },
        ],
      },
      {
        id: "y2025",
        heading: "2025",
        entries: [
          {
            id: "3",
            dateLabel: "05.10",
            title: "とても長いタイトルの記事で、狭い画面でも横スクロールが出ないことを確認するためのもの",
            tagLabel: "Travel",
          },
        ],
      },
      {
        id: "ynodate",
        heading: "日付なし",
        entries: [{ id: "4", dateLabel: "--.--", title: "日付のない記事", tagLabel: "Diary" }],
      },
    ],
  },
};
