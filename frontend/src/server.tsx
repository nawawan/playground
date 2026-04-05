import { Hono } from 'hono';

type Bindings = {
  ASSETS: {
    fetch: typeof fetch;
  };
};

const app = new Hono<{ Bindings: Bindings }>();

const fetchAsset = (request: Request, assets: Bindings['ASSETS'], path?: string) => {
  const assetUrl = new URL(request.url);

  if (path) {
    assetUrl.pathname = path;
  }

  return assets.fetch(new Request(assetUrl, request));
};

app.get('/', (c) => {
  return c.redirect('/maze/');
});

app.get('/maze', (c) => {
  return c.redirect('/maze/');
});

app.get('/maze/*', (c) => {
  return fetchAsset(c.req.raw, c.env.ASSETS, 'src/maze-creator/maze.html');
});

app.notFound((c) => {
  return fetchAsset(c.req.raw, c.env.ASSETS);
});

export default app;
