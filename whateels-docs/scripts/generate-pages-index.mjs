import { mkdir, readdir, writeFile, readFile } from 'node:fs/promises';
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

        const mdFiles = pageEntries.filter((p) => p.isFile() && p.name.endsWith('.md'));

        // Leemos el contenido de cada archivo para buscar su "order"
        const pagesWithOrder = await Promise.all(
          mdFiles.map(async (pageEntry) => {
            const filePath = join(categoryPath, pageEntry.name);
            const content = await readFile(filePath, 'utf-8');
            
            // Esta línea busca "order: número" sin importar si está en guiones o comentarios
            const match = content.match(/order:\s*(\d+)/);
            const order = match ? parseInt(match[1], 10) : 999;

            return {
              name: pageEntry.name.slice(0, -3),
              order: order
            };
          })
        );

        // Ordenamos numéricamente por la propiedad 'order'
        pagesWithOrder.sort((left, right) => left.order - right.order);

        return {
          name: entry.name,
          pages: pagesWithOrder.map(p => p.name), // Guardamos solo los nombres en el JSON
        };
      })
  );


  categories.sort((left, right) => left.name.localeCompare(right.name));

  await mkdir(srcAssetsRoot, { recursive: true });
  await writeFile(srcPagesIndexPath, JSON.stringify({ categories }, null, 2));
}

await buildPagesIndex();
