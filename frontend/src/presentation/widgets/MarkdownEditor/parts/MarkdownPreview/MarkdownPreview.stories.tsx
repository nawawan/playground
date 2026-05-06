import type { Meta, StoryObj } from '@storybook/react-vite';
import MarkdownPreview from './MarkdownPreview';

const meta = {
    title: 'MarkdownEditor/parts/MarkdownPreview',
    component: MarkdownPreview,
} satisfies Meta<typeof MarkdownPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        html: `<h1>Heading 1</h1><h2>Heading 2</h2><p>Normal paragraph text.</p><h3>Heading 3</h3><p>More content below.</p>`,
    },
};

export const Empty: Story = {
    args: { html: '' },
};
