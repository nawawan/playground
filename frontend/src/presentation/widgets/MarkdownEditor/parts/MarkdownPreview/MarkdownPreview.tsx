export type MarkdownPreviewProps = {
    html: string;
};

const MarkdownPreview = ({ html }: MarkdownPreviewProps) => (
    <div
        style={{
            width: '50%',
            height: '100%',
            overflowY: 'auto',
        }}
        dangerouslySetInnerHTML={{ __html: html }}
    />
);

export default MarkdownPreview;
