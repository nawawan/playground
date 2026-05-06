import { z } from 'zod';

export const MarkdownEditorSchema = z.object({
    title: z.string().min(1, 'タイトルは必須です'),
    slug: z
        .string()
        .min(1, 'スラッグは必須です')
        .regex(/^[a-z0-9-]+$/, '英小文字・数字・ハイフンのみ使用できます'),
});
