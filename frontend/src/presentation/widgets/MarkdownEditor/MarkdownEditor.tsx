import { useState, useRef, useCallback } from 'react';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import sanitizeHtml from 'sanitize-html';
import { Box, Button, Stack, styled, TextField } from '@mui/material';
import EditorPane from './parts/EditorPane/EditorPane';
import MarkdownPreview from './parts/MarkdownPreview/MarkdownPreview';
import { MarkdownEditorSchema } from './validation/SubmitBlogValidation';

const marked = new Marked(
    markedHighlight({
        emptyLangClass: 'hljs',
        langPrefix: 'hljs language-',
        highlight(code, lang) {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            try {
                return hljs.highlight(code, { language }).value;
            } catch {
                return code;
            }
        },
    })
);

const StyledButton = styled(Button)({
    backgroundColor: '#4f46e5',
    borderRadius: '5px',
    color: '#fff',
    '&:hover': {
        backgroundColor: '#4338ca',
    },
});

export type MarkdownEditorProps = {
    title?: string;
    slug?: string;
    onSave: (title: string, slug: string, markdown: string) => void;
    onSaveTemporary?: (markdown: string) => void;
};

const MarkdownEditor = (props: MarkdownEditorProps) => {
    const { onSaveTemporary } = props;
    const [markdown, setMarkdown] = useState('');
    const [html, setHtml] = useState('');
    const [title, setTitle] = useState(props.title ?? "");
    const [slug, setSlug] = useState(props.slug ?? "");
    const [errors, setErrors] = useState<{ title?: string; slug?: string }>({});
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const preRef = useRef<HTMLPreElement>(null);
    const lineNumRef = useRef<HTMLDivElement>(null);

    const updateMarkdown = useCallback(async (text: string) => {
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
        onSaveTemporary?.(text);
        setHtml(sanitizedHtml);
    }, [onSaveTemporary]);

    const handleChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        await updateMarkdown(e.target.value);
    };

    const handleInsert = useCallback(async (newMarkdown: string, cursorPos: number) => {
        await updateMarkdown(newMarkdown);
        requestAnimationFrame(() => {
            if (textareaRef.current) {
                textareaRef.current.selectionStart = cursorPos;
                textareaRef.current.selectionEnd = cursorPos;
            }
        });
    }, [updateMarkdown]);

    const handleScroll = () => {
        const scrollTop = textareaRef.current?.scrollTop ?? 0;
        if (preRef.current) preRef.current.scrollTop = scrollTop;
        if (lineNumRef.current) lineNumRef.current.scrollTop = scrollTop;
    };

    const lineCount = Math.max(markdown.split('\n').length, 1);

    const handleSave = () => {
        const result = MarkdownEditorSchema.safeParse({ title, slug });
        if (!result.success) {
            const newErrors: { title?: string; slug?: string } = {};
            for (const issue of result.error.issues) {
                const field = issue.path[0] as keyof typeof newErrors;
                if (!newErrors[field]) newErrors[field] = issue.message;
            }
            setErrors(newErrors);
            return;
        }
        setErrors({});
        props.onSave(title, slug, markdown);
    };

    return (
        <Stack spacing={2}>
            <Stack spacing={2} direction='row' alignItems='flex-start'>
                <TextField
                    required
                    label="title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    error={!!errors.title}
                    helperText={errors.title}
                />
                <TextField
                    required
                    label="slug"
                    value={slug}
                    onChange={e => setSlug(e.target.value)}
                    error={!!errors.slug}
                    helperText={errors.slug}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <StyledButton onClick={handleSave}>Save</StyledButton>
                </Box>
            </Stack>
            <Box sx={{ display: 'flex', gap: '20px', height: '400px' }}>
                <EditorPane
                    lineNumRef={lineNumRef}
                    preRef={preRef}
                    textareaRef={textareaRef}
                    markdown={markdown}
                    lineCount={lineCount}
                    onChange={handleChange}
                    onScroll={handleScroll}
                    onInsert={handleInsert}
                />
                <MarkdownPreview html={html} />
            </Box>
        </Stack>
    );
};

export default MarkdownEditor;
