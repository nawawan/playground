import { useState, useRef } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import sanitizeHtml from 'sanitize-html';
import EditorPane from './parts/EditorPane/EditorPane';
import MarkdownPreview from './parts/MarkdownPreview/MarkdownPreview';
import { Box, Button, Stack, styled } from '@mui/material';

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

const StyledButton = (styled(Button))({
    backgroundColor: '#4f46e5',
    borderRadius: '5px',
    color: '#fff',
    '&:hover': {
        backgroundColor: '#4338ca',
    },
});

type MarkdownEditorProps = {
    article_id: string;
    onSave: (markdown: string) => void;
};

const MarkdownEditor = (props: MarkdownEditorProps) => {
    const { article_id, onSave } = props;
    const [markdown, setMarkdown] = useState('');
    const [html, setHtml] = useState('');

    const saveContent = useDebouncedCallback((key: string, text: string) => {
        localStorage.setItem(key, text);
    }, 1000);
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
        saveContent(article_id, text);
        setHtml(sanitizedHtml);
    };

    const handleScroll = () => {
        const scrollTop = textareaRef.current?.scrollTop ?? 0;
        if (preRef.current) preRef.current.scrollTop = scrollTop;
        if (lineNumRef.current) lineNumRef.current.scrollTop = scrollTop;
    };

    const lineCount = Math.max(markdown.split('\n').length, 1);

    return (
        <Stack spacing={2}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <StyledButton onClick={() => onSave(markdown)}>
                    Save
                </StyledButton>
            </Box>
            <Box sx={{ display: 'flex', gap: '20px', height: '400px' }}>
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
            </Box>
        </Stack>
    );
};

export default MarkdownEditor;
