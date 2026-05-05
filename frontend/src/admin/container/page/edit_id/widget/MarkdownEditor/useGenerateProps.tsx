import { useCallback, useEffect, useState } from 'react';
import * as Sentry from '@sentry/react';
import type { MarkdownEditorProps } from '../../../../../../presentation/widgets/MarkdownEditor/MarkdownEditor';
import { useDebouncedCallback } from 'use-debounce';

const useGenerateProps = (article_id: string): MarkdownEditorProps => {
    const [markdown, setMarkdown] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const localDraft = localStorage.getItem(article_id);
            if (localDraft) {
                setMarkdown(localDraft);
                return;
            }

            const res = await fetch(`/api/blogs/${article_id}/md`);
            const draft: string = await res.json();
            setMarkdown(draft);
        };

        fetchData();
    }, []);

    const handleTemporarySave = useDebouncedCallback((markdown: string) => {
        if(article_id == "") return;
        localStorage.setItem(article_id, markdown);
    }, 1000);

    const handleSave = useCallback(async (title: string, slug: string, markdown: string) => {
        try {
            await fetch("api/blogs/", {
                method: "POST",
                body: JSON.stringify({
                    title: title, 
                    slug: slug, 
                    content: markdown
                }),
            });

            await fetch("api/blogs/:id/drafts", {
                method: "POST",
                body: markdown,
            });
        } catch (e) {
            Sentry.captureException(e);
        }
    }, []);

    return {
        markdown: markdown,
        onSave: handleSave,
        onSaveTemporary: handleTemporarySave
    };
};

export default useGenerateProps;