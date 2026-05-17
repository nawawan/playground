import { useCallback, useEffect, useState } from 'react';
import * as Sentry from '@sentry/react';
import type { MarkdownEditorProps } from '../../../../../../presentation/widgets/MarkdownEditor/MarkdownEditor';
import { useDebouncedCallback } from 'use-debounce';

const useGenerateProps = (article_id: string): MarkdownEditorProps & { loaded: boolean } => {
    const [markdown, setMarkdown] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const localDraft = localStorage.getItem(article_id);
            if (localDraft) {
                setMarkdown(localDraft);
                return;
            }
            try {
                const res = await fetch(`/api/blogs/${article_id}/md`);
                const draft: string = await res.json();
                setMarkdown(draft);
            } catch (e) {
                Sentry.captureException(e);
                setMarkdown('');
            }
        };

        fetchData();
    }, []);

    const handleTemporarySave = useDebouncedCallback((markdown: string) => {
        if(article_id == "") return;
        localStorage.setItem(article_id, markdown);
    }, 2000);

    const temporarySave = (inputText: string) => {
        handleTemporarySave(inputText);
    };

    const handleSave = useCallback(async (markdown: string, title?: string, slug?: string) => {
        try {
            await fetch("/api/blogs/", {
                method: "POST",
                body: JSON.stringify({
                    title: title, 
                    slug: slug, 
                    content: markdown
                }),
            });

            await fetch("/api/blogs/:id/md", {
                method: "POST",
                body: markdown,
            });
        } catch (e) {
            Sentry.captureException(e);
        }
    }, []);

    return {
        markdown: markdown ?? '',
        loaded: markdown !== null,
        onSave: handleSave,
        onSaveTemporary: temporarySave
    };
};

export default useGenerateProps;