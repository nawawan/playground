import { useState, useRef, useCallback, useEffect } from 'react';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import sanitizeHtml from 'sanitize-html';
import { Box, Button, Stack, styled } from '@mui/material';
import EditorPane from './parts/EditorPane/EditorPane';
import MarkdownPreview from './parts/MarkdownPreview/MarkdownPreview';
import InlineEditableField from '../../primitive/InlineEditableField/InlineEditableField';
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
    id: string;
    title?: string;
    slug?: string;
    markdown?: string;
    isPublished?: boolean;
    onSave: (markdown: string, id: string, title?: string, slug?: string, status?: string) => void;
    onSaveTemporary?: (markdown: string) => void;
};

const MarkdownEditor = (props: MarkdownEditorProps) => {
    const { onSaveTemporary } = props;
    const [markdown, setMarkdown] = useState(props.markdown ?? "");
    const [html, setHtml] = useState('');
    const [title, setTitle] = useState(props.title);
    const [slug, setSlug] = useState(props.slug);
    const [published, setPublished] = useState(props.isPublished ?? false);
    const [errors, setErrors] = useState<{ title?: string; slug?: string }>({});
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const preRef = useRef<HTMLPreElement>(null);
    const lineNumRef = useRef<HTMLDivElement>(null);
    const titleInputRef = useRef<HTMLInputElement>(null);
    const slugInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        updateMarkdown(markdown);
    }, []);

    const updateMarkdown = useCallback(async (text: string) => {
        if(text == '') return;
        setMarkdown(text);
        const rawHtml = await marked.parse(text);
        const sanitizedHtml = sanitizeHtml(rawHtml, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(['pre', 'code', 'span', 'img']),
            disallowedTagsMode: 'recursiveEscape',
            allowedAttributes: {
                ...sanitizeHtml.defaults.allowedAttributes,
                code: ['class'],
                span: ['class'],
                img: ['src', 'alt', 'title', 'width', 'height'],
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

    const validateFields = (): boolean => {
        const result = MarkdownEditorSchema.safeParse({ title, slug });
        if (!result.success) {
            const newErrors: { title?: string; slug?: string } = {};
            for (const issue of result.error.issues) {
                const field = issue.path[0] as keyof typeof newErrors;
                if (!newErrors[field]) newErrors[field] = issue.message;
            }
            setErrors(newErrors);
            if (newErrors.title) titleInputRef.current?.focus();
            else if (newErrors.slug) slugInputRef.current?.focus();
            return false;
        }
        setErrors({});
        return true;
    };

    const handleSave = () => {
        if (!validateFields()) return;
        props.onSave(markdown, props.id, title, slug, published ? 'PUBLISHED' : 'DRAFT');
    };

    const handlePublish = () => {
        if (!validateFields()) return;
        props.onSave(markdown, props.id, title, slug, 'PUBLISHED');
        setPublished(true);
    };

    return (
        <Stack spacing={2} sx={{ height: '100%', overflow: 'hidden', position: 'relative', pb: '80px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <InlineEditableField
                    inputRef={titleInputRef}
                    value={title}
                    onChange={setTitle}
                    placeholder="タイトルを入力"
                    error={errors.title}
                    fontWeight={700}
                    width={240}
                />
                <InlineEditableField
                    inputRef={slugInputRef}
                    value={slug}
                    onChange={setSlug}
                    placeholder="slugを入力"
                    error={errors.slug}
                    startAdornment="/"
                    fontSize="0.875rem"
                    color="text.secondary"
                    align="left"
                    width={160}
                />
            </Box>
            <Box sx={{ display: 'flex', gap: '20px', flex: 1, minHeight: 0 }}>
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
            <Box
                sx={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    gap: 1.5,
                    px: 3,
                    py: 2,
                    bgcolor: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(8px)',
                    borderTop: '1px solid rgba(0, 0, 0, 0.08)',
                }}
            >
                <Button variant="outlined" onClick={handleSave}>SAVE</Button>
                {!published && (
                    <StyledButton onClick={handlePublish}>公開する</StyledButton>
                )}
            </Box>
        </Stack>
    );
};

export default MarkdownEditor;
