import { Hono } from 'hono';
import type { FC } from 'hono/jsx'

const app = new Hono();

const renderHtmlTemplate = (entry: string) => `
  <!doctype html>
  <html lang="ja">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Maze Creator</title>
    </head>
    <body>
      <div id="root"></div>
      <script type="module" src="${entry}"></script>
    </body>
  </html>
`

app.get('/maze/*', (c) => {
  return c.html(renderHtmlTemplate('/src/maze-creator/main.tsx'));
});

export default app;
