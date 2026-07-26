import { Alert, Snackbar as MuiSnackbar } from '@mui/material';

export type SnackbarProps = {
    open: boolean;
    message: string;
    severity?: 'success' | 'error' | 'info' | 'warning';
    autoHideDuration?: number;
    onClose: () => void;
};

const Snackbar = (props: SnackbarProps) => (
    <MuiSnackbar
        open={props.open}
        autoHideDuration={props.autoHideDuration ?? 4000}
        onClose={props.onClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
        <Alert onClose={props.onClose} severity={props.severity ?? 'success'} variant="filled" sx={{ width: '100%' }}>
            {props.message}
        </Alert>
    </MuiSnackbar>
);

export default Snackbar;
