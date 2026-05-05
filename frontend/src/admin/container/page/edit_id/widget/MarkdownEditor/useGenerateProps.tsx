import { use, useCallback } from 'react';
import type { MarkdownEditorProps } from '../../../../../../presentation/widgets/MarkdownEditor/MarkdownEditor';
import { useDebouncedCallback } from 'use-debounce';

const useGenerateProps = (article_id: string): MarkdownEditorProps => {
    const handleTemporarySave = useDebouncedCallback((markdown: string) => {
        localStorage.setItem(article_id, markdown);
    }, 1000);

    const handleSave = useCallback(async (title: string, slug: string, markdown: string) => {
        await fetch("api/blogs/", {
            method: "PUT",
            body: JSON.stringify({
                title: title, 
                slug: slug, 
                content: markdown}
            ),
        });
    }, []);

    return { 
        onSave: handleSave,
        onSaveTemporary: handleTemporarySave
    };
};

export default useGenerateProps;