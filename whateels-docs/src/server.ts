import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.get('/api/pages-index', async (_req, res) => {
  try {
    const candidateRoots = [
      join(browserDistFolder, 'assets', 'pages'),
      join(process.cwd(), 'src', 'assets', 'pages'),
    ];

    let pagesRoot: string | null = null;
    let categoryEntries: Array<{ name: string; isDirectory: () => boolean }> | null = null;

    for (const candidateRoot of candidateRoots) {
      try {
        categoryEntries = await readdir(candidateRoot, { withFileTypes: true });
        pagesRoot = candidateRoot;
        break;
      } catch {
        // Try next location.
      }
    }

    if (!pagesRoot || !categoryEntries) {
      throw new Error('Pages root folder was not found.');
    }

    const categories = await Promise.all(
      categoryEntries
        .filter((entry) => entry.isDirectory())
        .map(async (entry) => {
          const categoryName = entry.name;
          const categoryPath = join(pagesRoot, categoryName);
          const pageEntries = await readdir(categoryPath, { withFileTypes: true });

          const pages = pageEntries
            .filter((pageEntry) => pageEntry.isFile() && pageEntry.name.endsWith('.md'))
            .map((pageEntry) => pageEntry.name.slice(0, -3))
            .sort((a, b) => a.localeCompare(b));

          return {
            name: categoryName,
            pages,
          };
        })
    );

    categories.sort((a, b) => a.name.localeCompare(b.name));
    res.json({ categories });
  } catch {
    res.status(500).json({ categories: [] });
  }
});

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
