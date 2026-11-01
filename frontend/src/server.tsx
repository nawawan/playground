import { Hono } from 'hono';
import { StaticRouter } from 'react-router-dom';
import { renderToString } from 'react-dom/server';
import * as Sentry from '@sentry/cloudflare';
import { BlogTopContainer } from './blog/container/page/blogs/Container';
import BlogContainer from './blog/container/page/blog_id/Container';

import blogs from './backend/pages/blogs';
import admin from './backend/pages/admin';

type Bindings = {
  ASSETS: {
    fetch: typeof fetch;
  };
  API_URL: string;
  DSN: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get('/assets/*', (c) => {
  return c.env.ASSETS.fetch(c.req.raw);
});

app.get('/blogs', (c) => {
  const htmlContent = renderToString(
    <StaticRouter location={c.req.path}>
      <BlogTopContainer />
    </StaticRouter>);
  return c.html(`
      <html>
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>My App</title>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet" />
        </head>
        <body>
          <div id="root">
            ${htmlContent}
          </div>
          <script type="module" src="/assets/blogClient.js"></script>
        </body>
      </html>
      `
  )
})

app.get('/blogs/:id', (c) => {
  const htmlContent = renderToString(
    <StaticRouter location={c.req.path}>
      <BlogContainer />
    </StaticRouter>);
  return c.html(`
      <html>
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>My App</title>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet" />
        </head>
        <body>
          <div id="root">
            ${htmlContent}
          </div>
          <script type="module" src="/assets/blogClient.js"></script>
        </body>
      </html>
      `
  )
})

app.route('/api/blogs', blogs);
app.route('/api/admin', admin);

app.get('*', (c) => {
  const url = new URL('/', c.req.url);
  return c.env.ASSETS.fetch(new Request(url.toString()));
});

const appWithSentry = Sentry.withSentry(
  (env: Bindings) => ({
    dsn: env.DSN,
    tracesSampleRate: 1.0,
  }),
  app
);

export default appWithSentry;
