import type { CSSProperties } from 'react';

export const FONT_SIZE = 15;
export const LINE_HEIGHT = 1.65;
export const PADDING = 12;
export const FONT_FAMILY = "ui-monospace, 'SFMono-Regular', Menlo, Consolas, 'Liberation Mono', monospace";

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
