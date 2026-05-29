import { copyFile, mkdir, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const projectRoot = process.cwd();
const pagesRoot = join(projectRoot, 'src', 'assets', 'pages');
const browserRoot = join(projectRoot, 'dist', 'whateels-docs', 'browser');
const pagesIndexPath = join(browserRoot, 'assets', 'pages-index.json');
const indexCsrHtmlPath = join(browserRoot, 'index.csr.html');
const indexHtmlPath = join(browserRoot, 'index.html');
const notFoundHtmlPath = join(browserRoot, '404.html');

async function buildPagesIndex() {
  const categoryEntries = await readdir(pagesRoot, { withFileTypes: true });

  const categories = await Promise.all(
    categoryEntries
      .filter((entry) => entry.isDirectory())
      .map(async (entry) => {
        const categoryPath = join(pagesRoot, entry.name);
        const pageEntries = await readdir(categoryPath, { withFileTypes: true });

        return {
          name: entry.name,
          pages: pageEntries
            .filter((pageEntry) => pageEntry.isFile() && pageEntry.name.endsWith('.md'))
            .map((pageEntry) => pageEntry.name.slice(0, -3))
            .sort((left, right) => left.localeCompare(right)),
        };
      })
  );

  categories.sort((left, right) => left.name.localeCompare(right.name));

  await mkdir(join(browserRoot, 'assets'), { recursive: true });
  await writeFile(pagesIndexPath, JSON.stringify({ categories }, null, 2));
}

async function createSpaFallback() {
  await copyFile(indexCsrHtmlPath, indexHtmlPath);
  await copyFile(indexCsrHtmlPath, notFoundHtmlPath);
}

await buildPagesIndex();
await createSpaFallback();