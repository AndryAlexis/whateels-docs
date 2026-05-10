
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/whateels-docs/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/whateels-docs"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 2437, hash: '4f0a17b57b0e3acfc0bfb8367ceaa68c1844e9a56cd8a1210245ba8bf8f27cb8', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 964, hash: '609411f85028c3eb7ae55e66b06bf682e505dd4010e5deac6cb90d4209b80901', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 1966218, hash: 'a1aae0816d0068a07953c776367071d053b05693f19529da5877ebb07311de01', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-5P4YNK7K.css': {size: 77728, hash: 'BeGgdEiMxC0', text: () => import('./assets-chunks/styles-5P4YNK7K_css.mjs').then(m => m.default)}
  },
};
