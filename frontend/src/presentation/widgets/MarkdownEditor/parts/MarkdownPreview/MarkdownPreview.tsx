export type MarkdownPreviewProps = {
    html: string;
};

const MarkdownPreview = ({ html }: MarkdownPreviewProps) => (
    <div
        style={{
            width: '50%',
            height: '300px',
            border: '1px solid #ccc',
            padding: '10px',
            overflowY: 'auto',
        }}
        dangerouslySetInnerHTML={{ __html: html }}
    />
);

export default MarkdownPreview;
