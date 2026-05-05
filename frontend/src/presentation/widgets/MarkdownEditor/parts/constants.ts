import type { CSSProperties } from 'react';

export const FONT_SIZE = 14;
export const LINE_HEIGHT = 1.5;
export const PADDING = 10;
export const FONT_FAMILY = "'Geist Mono', 'Fira Code', Consolas, monospace";

export const sharedEditorStyle: CSSProperties = {
    fontSize: FONT_SIZE,
    lineHeight: LINE_HEIGHT,
    fontFamily: FONT_FAMILY,
    padding: PADDING,
    margin: 0,
    whiteSpace: 'pre-wrap',
    overflowWrap: 'break-word',
    boxSizing: 'border-box',
};
