import { useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import LineNumbers from './LineNumbers';

const LineNumbersPreview = ({ lineCount }: { lineCount: number }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    return <LineNumbers scrollRef={scrollRef} lineCount={lineCount} />;
};

const meta = {
    title: 'MarkdownEditor/parts/LineNumbers',
    component: LineNumbersPreview,
} satisfies Meta<typeof LineNumbersPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { lineCount: 10 },
};

export const ManyLines: Story = {
    args: { lineCount: 50 },
};
