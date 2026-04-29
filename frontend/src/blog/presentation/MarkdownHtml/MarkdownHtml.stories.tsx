import type { Meta, StoryObj } from "@storybook/react-vite";

import MarkdownHtml from "./MarkdownHtml";

const meta = {
  title: "MarkdownHtml",
  component: MarkdownHtml,
} satisfies Meta<typeof MarkdownHtml>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleHtmlBody = `
<h1>記事タイトル</h1>
<p>これはMarkdownから生成されたHTMLのサンプルです。</p>

<h2>見出し2</h2>
<p>段落テキストです。<a href="#">リンク</a>も含まれます。</p>

<h3>見出し3</h3>
<ul>
  <li>リスト項目 1</li>
  <li>リスト項目 2</li>
  <li>リスト項目 3</li>
</ul>

<ol>
  <li>番号付きリスト 1</li>
  <li>番号付きリスト 2</li>
</ol>

<blockquote>
  <p>これは引用ブロックです。</p>
</blockquote>

<p>インラインコード: <code>const x = 1;</code></p>

<pre><code>// コードブロック
function hello(name: string): string {
  return \`Hello, \${name}!\`;
}
</code></pre>

<table>
  <thead>
    <tr><th>列1</th><th>列2</th></tr>
  </thead>
  <tbody>
    <tr><td>セル1</td><td>セル2</td></tr>
    <tr><td>セル3</td><td>セル4</td></tr>
  </tbody>
</table>

<hr />
<p>最後の段落です。</p>
`;

export const Default: Story = {
  args: {
    htmlBody: sampleHtmlBody,
  },
};
