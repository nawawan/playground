import * as React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    IconButton,
    Box,
    Typography,
    InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

type LoginDialogProps = {
    open: boolean;
    onClose: () => void;
    onLogin: (username: string, password: string) => void;
};

function LoginDialog({ open, onClose, onLogin }: LoginDialogProps) {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");

    const handleLogin = () => {
        onLogin(username, password);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleLogin();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: "2px",
                        background: "#FAFAF8",
                        boxShadow: "0 8px 40px rgba(20, 20, 40, 0.18), 0 1px 4px rgba(20, 20, 40, 0.08)",
                        overflow: "hidden",
                        "&::before": {
                            content: '""',
                            display: "block",
                            height: "3px",
                            background: "linear-gradient(90deg, #1A1A2E 0%, #4A4A8A 60%, #8A7A6A 100%)",
                        },
                    },
                },
            }}
        >
            {/* Header */}
            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 3.5,
                    pt: 3,
                    pb: 0,
                }}
            >
                <Box>
                    <Typography
                        sx={{
                            fontFamily: "'Noto Serif JP', 'Hiragino Mincho ProN', 'Yu Mincho', serif",
                            fontSize: "1.35rem",
                            fontWeight: 500,
                            color: "#1A1A2E",
                            letterSpacing: "0.12em",
                        }}
                    >
                        ログイン
                    </Typography>
                    <Box
                        sx={{
                            mt: 0.5,
                            height: "1px",
                            width: "2rem",
                            background: "linear-gradient(90deg, #4A4A8A, transparent)",
                        }}
                    />
                </Box>
                <IconButton
                    onClick={onClose}
                    size="small"
                    sx={{
                        color: "#9A9A9A",
                        border: "1px solid #E8E8E4",
                        borderRadius: "2px",
                        width: 28,
                        height: 28,
                        transition: "all 0.2s ease",
                        "&:hover": {
                            color: "#1A1A2E",
                            borderColor: "#1A1A2E",
                            background: "transparent",
                        },
                    }}
                >
                    <CloseIcon sx={{ fontSize: "0.85rem" }} />
                </IconButton>
            </DialogTitle>

            {/* Form */}
            <DialogContent sx={{ px: 3.5, pt: 3, pb: 1 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                    {/* Username */}
                    <Box>
                        <Typography
                            component="label"
                            htmlFor="login-username"
                            sx={{
                                display: "block",
                                fontFamily: "'Noto Sans JP', sans-serif",
                                fontSize: "0.7rem",
                                fontWeight: 600,
                                letterSpacing: "0.15em",
                                color: "#6A6A7A",
                                mb: 0.75,
                                textTransform: "uppercase",
                            }}
                        >
                            ユーザ名
                        </Typography>
                        <TextField
                            id="login-username"
                            fullWidth
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoComplete="username"
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonOutlineIcon sx={{ fontSize: "1rem", color: "#9A9AA8" }} />
                                        </InputAdornment>
                                    ),
                                    sx: {
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                        fontSize: "0.9rem",
                                        color: "#1A1A2E",
                                        background: "#FFFFFF",
                                        borderRadius: "2px",
                                        "& input": {
                                            py: 1.25,
                                        },
                                    },
                                },
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "2px",
                                    "& fieldset": {
                                        borderColor: "#DEDED8",
                                        borderWidth: "1px",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "#4A4A8A",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#4A4A8A",
                                        borderWidth: "1.5px",
                                    },
                                },
                            }}
                        />
                    </Box>

                    {/* Password */}
                    <Box>
                        <Typography
                            component="label"
                            htmlFor="login-password"
                            sx={{
                                display: "block",
                                fontFamily: "'Noto Sans JP', sans-serif",
                                fontSize: "0.7rem",
                                fontWeight: 600,
                                letterSpacing: "0.15em",
                                color: "#6A6A7A",
                                mb: 0.75,
                                textTransform: "uppercase",
                            }}
                        >
                            パスワード
                        </Typography>
                        <TextField
                            id="login-password"
                            fullWidth
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoComplete="current-password"
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockOutlinedIcon sx={{ fontSize: "1rem", color: "#9A9AA8" }} />
                                        </InputAdornment>
                                    ),
                                    sx: {
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                        fontSize: "0.9rem",
                                        color: "#1A1A2E",
                                        background: "#FFFFFF",
                                        borderRadius: "2px",
                                        "& input": {
                                            py: 1.25,
                                        },
                                    },
                                },
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "2px",
                                    "& fieldset": {
                                        borderColor: "#DEDED8",
                                        borderWidth: "1px",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "#4A4A8A",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#4A4A8A",
                                        borderWidth: "1.5px",
                                    },
                                },
                            }}
                        />
                    </Box>
                </Box>
            </DialogContent>

            {/* Actions */}
            <DialogActions sx={{ px: 3.5, pt: 2, pb: 3.5 }}>
                <Button
                    fullWidth
                    onClick={handleLogin}
                    endIcon={<ArrowForwardIcon sx={{ fontSize: "0.95rem !important" }} />}
                    sx={{
                        fontFamily: "'Noto Sans JP', sans-serif",
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        letterSpacing: "0.18em",
                        color: "#FAFAF8",
                        background: "#1A1A2E",
                        borderRadius: "2px",
                        py: 1.4,
                        textTransform: "none",
                        transition: "all 0.22s ease",
                        "&:hover": {
                            background: "#4A4A8A",
                            boxShadow: "0 4px 16px rgba(74, 74, 138, 0.35)",
                        },
                        "&:active": {
                            transform: "translateY(1px)",
                        },
                    }}
                >
                    ログイン
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default LoginDialog;
