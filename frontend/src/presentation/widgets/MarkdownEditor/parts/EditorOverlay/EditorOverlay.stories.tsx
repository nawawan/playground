import { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import EditorOverlay from './EditorOverlay';

const SAMPLE_MARKDOWN = `# Heading 1
## Heading 2

Normal paragraph text.

### Heading 3

More content below.`;

const EditorOverlayPreview = ({ initialMarkdown }: { initialMarkdown: string }) => {
    const preRef = useRef<HTMLPreElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [markdown, setMarkdown] = useState(initialMarkdown);

    return (
        <div style={{ height: '200px', position: 'relative', backgroundColor: '#0d1117', borderRadius: '6px' }}>
            <EditorOverlay
                preRef={preRef}
                textareaRef={textareaRef}
                markdown={markdown}
                onChange={e => setMarkdown(e.target.value)}
                onScroll={() => {
                    if (textareaRef.current && preRef.current) {
                        preRef.current.scrollTop = textareaRef.current.scrollTop;
                    }
                }}
                onInsert={(newMarkdown, cursorPos) => {
                    setMarkdown(newMarkdown);
                    setTimeout(() => {
                        if (textareaRef.current) {
                            textareaRef.current.selectionStart = cursorPos;
                            textareaRef.current.selectionEnd = cursorPos;
                        }
                    }, 0);
                }}
            />
        </div>
    );
};

const meta = {
    title: 'MarkdownEditor/parts/EditorOverlay',
    component: EditorOverlayPreview,
} satisfies Meta<typeof EditorOverlayPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { initialMarkdown: SAMPLE_MARKDOWN },
};

export const Empty: Story = {
    args: { initialMarkdown: '' },
};
