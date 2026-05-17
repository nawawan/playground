import { z } from 'zod';

export const MarkdownEditorSchema = z.object({
    title: z.string().min(0),
    slug: z
        .string()
        .min(0)
        .regex(/^[a-z0-9-]*$/, '英小文字・数字・ハイフンのみ使用できます'),
});
