import { Box } from '@mui/material';

export type MarkdownPreviewProps = {
    html: string;
};

const MarkdownPreview = ({ html }: MarkdownPreviewProps) => (
    <Box
        sx={{
            flex: 1,
            height: '100%',
            overflowY: 'auto',
            px: 3,
            '& h1': { fontSize: '1.75rem', fontWeight: 700, mt: 0, mb: 1.5, pb: 0.5, borderBottom: '1px solid #30363d' },
            '& h2': { fontSize: '1.4rem',  fontWeight: 600, mt: 0, mb: 1,   pb: 0.5, borderBottom: '1px solid #30363d' },
            '& h3': { fontSize: '1.2rem',  fontWeight: 600, mt: 0, mb: 0.5 },
            '& h4': { fontSize: '1.05rem', fontWeight: 600 },
            '& h5': { fontSize: '0.95rem', fontWeight: 600 },
            '& h6': { fontSize: '0.85rem', fontWeight: 600, color: '#8b949e' },
            '& p':  { lineHeight: 1.75 },
            '& code:not(pre > code)': {
                fontFamily: "ui-monospace, Menlo, Consolas, monospace",
                fontSize: '0.875em',
                backgroundColor: 'rgba(110,118,129,0.2)',
                borderRadius: '4px',
                padding: '0.2em 0.4em',
            },
            '& pre': {
                backgroundColor: '#161b22',
                borderRadius: '6px',
                padding: '1rem',
                overflowX: 'auto',
                '& code': { backgroundColor: 'transparent', padding: 0 },
            },
        }}
        dangerouslySetInnerHTML={{ __html: html }}
    />
);

export default MarkdownPreview;
