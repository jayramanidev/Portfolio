import fs from 'fs';
import path from 'path';

const today = new Date().toISOString().split('T')[0];
const sitemapPath = path.resolve('public/sitemap.xml');

let content = fs.readFileSync(sitemapPath, 'utf-8');
content = content.replace(/<lastmod>.*?<\/lastmod>/g, `<lastmod>${today}</lastmod>`);
fs.writeFileSync(sitemapPath, content, 'utf-8');

console.log(`✅ Sitemap updated with date: ${today}`);
