import LineNumbers from '../LineNumbers/LineNumbers';
import EditorOverlay from '../EditorOverlay/EditorOverlay';

export type EditorPaneProps = {
    lineNumRef: React.RefObject<HTMLDivElement | null>;
    preRef: React.RefObject<HTMLPreElement | null>;
    textareaRef: React.RefObject<HTMLTextAreaElement | null>;
    markdown: string;
    lineCount: number;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onScroll: () => void;
    onInsert: (newMarkdown: string, cursorPos: number) => void;
};

const EditorPane = ({ lineNumRef, preRef, textareaRef, markdown, lineCount, onChange, onScroll, onInsert }: EditorPaneProps) => {
    return (
        <div
            style={{
                flex: 1,
                height: '100%',
                display: 'flex',
                backgroundColor: '#0d1117',
                borderRadius: '6px',
                overflow: 'hidden',
                border: '1px solid #30363d',
            }}
        >
            <LineNumbers scrollRef={lineNumRef} lineCount={lineCount} />
            <EditorOverlay
                preRef={preRef}
                textareaRef={textareaRef}
                markdown={markdown}
                onChange={onChange}
                onScroll={onScroll}
                onInsert={onInsert}
            />
        </div>
    );
};

export default EditorPane;
