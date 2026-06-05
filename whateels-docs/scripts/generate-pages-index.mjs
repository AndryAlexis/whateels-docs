import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const projectRoot = process.cwd();
const pagesRoot = join(projectRoot, 'src', 'assets', 'pages');
const srcAssetsRoot = join(projectRoot, 'src', 'assets');
const srcPagesIndexPath = join(srcAssetsRoot, 'pages-index.json');

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

  await mkdir(srcAssetsRoot, { recursive: true });
  await writeFile(srcPagesIndexPath, JSON.stringify({ categories }, null, 2));
}

await buildPagesIndex();
