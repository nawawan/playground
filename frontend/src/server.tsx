import { Hono } from 'hono';

type Bindings = {
  ASSETS: {
    fetch: typeof fetch;
  };
};

const app = new Hono<{ Bindings: Bindings }>();


app.get('/apps/*', async (c) => {
  const asset = await c.env.ASSETS.fetch(c.req.raw)
  if (asset.status !== 404) return asset;

  return c.env.ASSETS.fetch(
    new Request(new URL('index.html', c.req.url))
  )
})

// app.get('/blog', (c) => {
//   return c.redirect('/maze/');
// });

export default app;
