import { readFile, writeFile } from 'node:fs/promises';

const html = await readFile('index.html', 'utf8');
const css = await readFile('styles.css', 'utf8');
const js = await readFile('script.js', 'utf8');

const standalone = html
  .replace(/<link rel="stylesheet" href="styles\.css">/, `<style>\n${css}\n</style>`)
  .replace(/<script type="module" src="script\.js"><\/script>/, `<script type="module">\n${js}\n</script>`);

await writeFile('monsterball-3d.html', standalone, 'utf8');
console.log('monsterball-3d.html created');
