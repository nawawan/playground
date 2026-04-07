import { Hono } from 'hono';
import { StaticRouter } from 'react-router-dom';
import { renderToString } from 'react-dom/server';
import { BlogTopContainer } from './blog/container/page/blogs/Container';

type Bindings = {
  ASSETS: {
    fetch: typeof fetch;
  };
};

const app = new Hono<{ Bindings: Bindings }>();

app.get('/assets/*', (c) => {
  return c.env.ASSETS.fetch(c.req.raw);
});

app.get('/blogs', (c) => {
  const htmlContent = renderToString(
    <StaticRouter location="/blogs">
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

// app.get('/blog', (c) => {
//   return c.redirect('/maze/');
// });

export default app;
