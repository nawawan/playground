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
                    `<span style="color:#8b7ce1">${escapeHtml(headingMatch[1])}</span>` +
                    `<span style="color:#8b7ce1">${escapeHtml(headingMatch[2])}</span>`
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
    onInsert: (newMarkdown: string, cursorPos: number) => void;
};

const EditorOverlay = ({ preRef, textareaRef, markdown, onChange, onScroll, onInsert }: EditorOverlayProps) => {

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length === 0) return;
        const file = files[0];
        if (!file.type.startsWith("image/")) return;

        const cursorPos = textareaRef.current?.selectionStart ?? markdown.length;
        const res = await fetch("/api/blogs/images", {
            method: "PUT",
            body: file,
            headers: { 'Content-Type': file.type }
        });
        const url: string = await res.json();
        const inserted = `![${file.name}](${url})`;
        const newMarkdown = markdown.slice(0, cursorPos) + inserted + markdown.slice(cursorPos);
        onInsert(newMarkdown, cursorPos + inserted.length);
    };
    return (
        <div 
            style={{ position: 'relative', flex: 1, overflow: 'hidden' }}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
        >
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
};

export default EditorOverlay;
