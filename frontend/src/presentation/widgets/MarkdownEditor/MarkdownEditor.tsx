import { useState, useRef } from 'react';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import sanitizeHtml from 'sanitize-html';
import EditorPane from './parts/EditorPane/EditorPane';
import MarkdownPreview from './parts/MarkdownPreview/MarkdownPreview';

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
            <EditorPane
                lineNumRef={lineNumRef}
                preRef={preRef}
                textareaRef={textareaRef}
                markdown={markdown}
                lineCount={lineCount}
                onChange={handleChange}
                onScroll={handleScroll}
            />
            <MarkdownPreview html={html} />
        </div>
    );
};

export default MarkdownEditor;
