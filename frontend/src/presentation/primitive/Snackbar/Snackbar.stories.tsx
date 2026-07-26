import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@mui/material';
import Snackbar from './Snackbar';

const SnackbarPreview = ({ message, severity }: { message: string; severity: 'success' | 'error' | 'info' | 'warning' }) => {
    const [open, setOpen] = useState(true);
    return (
        <>
            <Button onClick={() => setOpen(true)}>表示する</Button>
            <Snackbar open={open} message={message} severity={severity} onClose={() => setOpen(false)} />
        </>
    );
};

const meta = {
    title: 'primitive/Snackbar',
    component: SnackbarPreview,
} satisfies Meta<typeof SnackbarPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
    args: { message: '保存しました', severity: 'success' },
};

export const Error: Story = {
    args: { message: '保存に失敗しました', severity: 'error' },
};
