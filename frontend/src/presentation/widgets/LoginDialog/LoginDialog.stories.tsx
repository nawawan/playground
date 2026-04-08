import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@mui/material";
import LoginDialog from "./LoginDialog";

const meta = {
    title: "Widget/LoginDialog",
    component: LoginDialog,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof LoginDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

function LoginDialogDemo(props: { onLogin?: (u: string, p: string) => void }) {
    const [open, setOpen] = React.useState(false);

    return (
        <>
            <Button variant="outlined" onClick={() => setOpen(true)}>
                ログインダイアログを開く
            </Button>
            <LoginDialog
                open={open}
                onClose={() => setOpen(false)}
                onLogin={(username, password) => {
                    props.onLogin?.(username, password);
                    setOpen(false);
                }}
            />
        </>
    );
}

export const Default: Story = {
    args: {
        open: true,
        onClose: () => {},
        onLogin: (username, password) => {
            console.log("Login:", { username, password });
        },
    },
};

export const Interactive: Story = {
    render: () => (
        <LoginDialogDemo
            onLogin={(u, p) => console.log("Login:", { username: u, password: p })}
        />
    ),
    args: {
        open: false,
        onClose: () => {},
        onLogin: () => {},
    },
};
