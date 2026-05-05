import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT, PADDING } from '../constants';

export type LineNumbersProps = {
    scrollRef: React.RefObject<HTMLDivElement | null>;
    lineCount: number;
};

const LineNumbers = ({ scrollRef, lineCount }: LineNumbersProps) => (
    <div
        ref={scrollRef}
        style={{
            overflowY: 'hidden',
            backgroundColor: '#161b22',
            borderRight: '1px solid #30363d',
            color: '#484f58',
            textAlign: 'right',
            padding: `${PADDING}px 10px`,
            minWidth: '20px',
            fontSize: FONT_SIZE,
            lineHeight: LINE_HEIGHT,
            fontFamily: FONT_FAMILY,
            userSelect: 'none',
            flexShrink: 0,
            boxSizing: 'border-box',
        }}
    >
        {Array.from({ length: lineCount }, (_, i) => (
            <div key={i + 1}>{i + 1}</div>
        ))}
    </div>
);

export default LineNumbers;
