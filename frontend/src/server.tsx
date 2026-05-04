import { Hono } from 'hono';
import { StaticRouter } from 'react-router-dom';
import { renderToString } from 'react-dom/server';
import * as Sentry from '@sentry/cloudflare';
import { BlogTopContainer } from './blog/container/page/blogs/Container';
import BlogContainer from './blog/container/page/blog_id/Container';

import blogs from './backend/pages/blogs';

type Bindings = {
  ASSETS: {
    fetch: typeof fetch;
  };
  API_URL: string;
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

app.get('*', (c) => {
  const url = new URL('/', c.req.url);
  return c.env.ASSETS.fetch(new Request(url.toString()));
});

export default Sentry.withSentry(
  (env: Bindings) => ({
    dsn: "https://54edfa7ae3ff6c3962b2089c7cf85591@o4511330126135296.ingest.us.sentry.io/4511330155364352",
    tracesSampleRate: 1.0,
  }),
  app
);
