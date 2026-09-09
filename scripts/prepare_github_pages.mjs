import { copyFile, mkdir, readdir, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';

// GitHub Pages has no rewrite rules. Directory indexes allow direct visits
// and refreshes of /activities/<slug> and /activities/<slug>/.
const output = path.resolve('dist/client');
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/$/, '');
if (basePath) {
  if (!/^\/[a-zA-Z0-9._-]+$/.test(basePath) || basePath === '/..') {
    throw new Error('GitHub Pages 仓库路径无效。');
  }
  // Vinext puts prefixed assets inside a matching disk directory. Pages adds
  // the repository prefix itself, so publish _next from the artifact root.
  await rename(
    path.join(output, basePath.slice(1), '_next'),
    path.join(output, '_next'),
  );
}
const activities = path.join(output, 'activities');
const pages = (await readdir(activities)).filter((file) =>
  file.endsWith('.html'),
);
if (!pages.length) throw new Error('未找到静态活动页面，停止发布。');

for (const page of pages) {
  const directory = path.join(activities, page.slice(0, -5));
  await mkdir(directory, { recursive: true });
  await copyFile(
    path.join(activities, page),
    path.join(directory, 'index.html'),
  );
}
await writeFile(path.join(output, '.nojekyll'), '');
console.log(`GitHub Pages：已生成 ${pages.length} 个活动目录入口。`);
