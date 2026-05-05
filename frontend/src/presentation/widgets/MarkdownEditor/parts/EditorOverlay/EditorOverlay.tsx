import { sharedEditorStyle } from '../constants';

const escapeHtml = (text: string): string =>
    text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const highlightMarkdownSyntax = (text: string): string =>
    text
        .split('\n')
        .map(line => {
            const headingMatch = line.match(/^(#{1,6})(.*)$/);
            if (headingMatch) {
                return (
                    `<span style="color:#8b5cf6">${escapeHtml(headingMatch[1])}</span>` +
                    `<span style="color:#8b5cf6">${escapeHtml(headingMatch[2])}</span>`
                );
            }
            return `<span style="color:#e2e8f0">${escapeHtml(line)}</span>`;
        })
        .join('\n');

export type EditorOverlayProps = {
    preRef: React.RefObject<HTMLPreElement | null>;
    textareaRef: React.RefObject<HTMLTextAreaElement | null>;
    markdown: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onScroll: () => void;
};

const EditorOverlay = ({ preRef, textareaRef, markdown, onChange, onScroll }: EditorOverlayProps) => (
    <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
        <pre
            ref={preRef}
            aria-hidden="true"
            style={{
                ...sharedEditorStyle,
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                overflow: 'hidden',
                pointerEvents: 'none',
                backgroundColor: 'transparent',
                color: '#e2e8f0',
            }}
            dangerouslySetInnerHTML={{ __html: highlightMarkdownSyntax(markdown) + '\n' }}
        />
        <textarea
            ref={textareaRef}
            value={markdown}
            onChange={onChange}
            onScroll={onScroll}
            placeholder="Enter markdown here..."
            spellCheck={false}
            style={{
                ...sharedEditorStyle,
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                resize: 'none',
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                color: 'transparent',
                caretColor: '#e2e8f0',
                overflow: 'auto',
            }}
        />
    </div>
);

export default EditorOverlay;
