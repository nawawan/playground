import { useState, useRef } from 'react';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import sanitizeHtml from 'sanitize-html';

const marked = new Marked(
    markedHighlight({
        emptyLangClass: 'hljs',
        langPrefix: 'hljs language-',
        highlight(code, lang, _) {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            try {
                return hljs.highlight(code, { language }).value;
            } catch (error) {
                return code;
            }
        }
    })
);

const escapeHtml = (text: string): string =>
    text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// #, ##, ### などの見出しを紫色でハイライト
const highlightMarkdownSyntax = (text: string): string =>
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

const FONT_SIZE = 14;
const LINE_HEIGHT = 1.5;
const PADDING = 10;
const FONT_FAMILY = "'Fira Code', 'Cascadia Code', Consolas, monospace";

const sharedEditorStyle: React.CSSProperties = {
    fontSize: FONT_SIZE,
    lineHeight: LINE_HEIGHT,
    fontFamily: FONT_FAMILY,
    padding: PADDING,
    margin: 0,
    whiteSpace: 'pre-wrap',
    overflowWrap: 'break-word',
    boxSizing: 'border-box',
};

const MarkdownEditor = () => {
    const [markdown, setMarkdown] = useState('');
    const [html, setHtml] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const preRef = useRef<HTMLPreElement>(null);
    const lineNumRef = useRef<HTMLDivElement>(null);

    const handleChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        setMarkdown(text);
        const rawHtml = await marked.parse(text);
        const sanitizedHtml = sanitizeHtml(rawHtml, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(['pre', 'code', 'span']),
            disallowedTagsMode: 'recursiveEscape',
            allowedAttributes: {
                ...sanitizeHtml.defaults.allowedAttributes,
                code: ['class'],
                span: ['class'],
            },
        });
        setHtml(sanitizedHtml);
    };

    const handleScroll = () => {
        const scrollTop = textareaRef.current?.scrollTop ?? 0;
        if (preRef.current) preRef.current.scrollTop = scrollTop;
        if (lineNumRef.current) lineNumRef.current.scrollTop = scrollTop;
    };

    const lineCount = Math.max(markdown.split('\n').length, 1);

    return (
        <div style={{ display: 'flex', gap: '20px' }}>
            {/* Editor */}
            <div
                style={{
                    width: '50%',
                    height: '300px',
                    display: 'flex',
                    backgroundColor: '#0d1117',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    border: '1px solid #30363d',
                }}
            >
                {/* Line numbers */}
                <div
                    ref={lineNumRef}
                    style={{
                        overflowY: 'hidden',
                        backgroundColor: '#161b22',
                        borderRight: '1px solid #30363d',
                        color: '#484f58',
                        textAlign: 'right',
                        padding: `${PADDING}px 10px`,
                        minWidth: '20px',
                        fontSize: FONT_SIZE,
                        lineHeight: LINE_HEIGHT,
                        fontFamily: FONT_FAMILY,
                        userSelect: 'none',
                        flexShrink: 0,
                        boxSizing: 'border-box',
                    }}
                >
                    {Array.from({ length: lineCount }, (_, i) => (
                        <div key={i + 1}>{i + 1}</div>
                    ))}
                </div>

                {/* Highlighted overlay + textarea */}
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
                        onChange={handleChange}
                        onScroll={handleScroll}
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
            </div>

            {/* Preview */}
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
        </div>
    );
};

export default MarkdownEditor;
