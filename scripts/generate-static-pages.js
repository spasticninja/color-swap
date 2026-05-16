#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const boards = require('../data/game-boards.json');

const docsDir = path.resolve(__dirname, '..', 'docs');
const baseHtmlPath = path.join(docsDir, 'index.html');
const siteOrigin = (process.env.SITE_ORIGIN || 'https://spasticninja.github.io/color-swap').replace(/\/+$/, '');

const escapeHtml = (value) => (
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
);

const getPublicUrl = (routePath) => (
  routePath ? `${siteOrigin}/${routePath}/` : `${siteOrigin}/`
);

const getRelativeAssetPrefix = (outputPath) => {
  const directory = path.dirname(outputPath);
  if (directory === '.') {
    return '';
  }

  return `${directory.split(path.sep).map(() => '..').join('/')}/`;
};

const withAssetPrefix = (html, assetPrefix) => (
  html
    .replace(/href="(src\.[^"]+\.css)"/g, `href="${assetPrefix}$1"`)
    .replace(/src="(src\.[^"]+\.js)"/g, `src="${assetPrefix}$1"`)
);

const getMetaBlock = ({ title, description, routePath }) => {
  const escapedTitle = escapeHtml(title);
  const escapedDescription = escapeHtml(description);
  const publicUrl = getPublicUrl(routePath);
  const structuredData = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': routePath === '' ? 'WebSite' : routePath.startsWith('game/') || routePath.startsWith('games/') ? 'Game' : 'WebPage',
    name: title,
    description,
    url: publicUrl
  }).replace(/<\//g, '<\\/');

  return [
    `<title>${escapedTitle}</title>`,
    `<meta name="description" content="${escapedDescription}">`,
    '<meta name="robots" content="index,follow">',
    '<meta name="theme-color" content="#ddb08c">',
    `<link rel="canonical" href="${publicUrl}">`,
    `<meta property="og:site_name" content="Color Swap">`,
    '<meta property="og:type" content="website">',
    `<meta property="og:title" content="${escapedTitle}">`,
    `<meta property="og:description" content="${escapedDescription}">`,
    `<meta property="og:url" content="${publicUrl}">`,
    '<meta property="og:locale" content="en_US">',
    '<meta name="twitter:card" content="summary">',
    `<meta name="twitter:title" content="${escapedTitle}">`,
    `<meta name="twitter:description" content="${escapedDescription}">`,
    `<script type="application/ld+json">${structuredData}</script>`
  ].join('\n  ');
};

const buildHtml = (htmlTemplate, page, outputPath) => {
  const assetPrefix = getRelativeAssetPrefix(outputPath);
  const htmlWithAssets = withAssetPrefix(htmlTemplate, assetPrefix);
  const metaBlock = getMetaBlock(page);

  return htmlWithAssets
    .replace(/<title>[\s\S]*?<\/title>/, metaBlock)
    .replace(/<html lang="en">/, '<html lang="en" prefix="og: https://ogp.me/ns#">');
};

const writePage = (htmlTemplate, page) => {
  const outputPath = page.routePath ? path.join(page.routePath, 'index.html') : 'index.html';
  const destination = path.join(docsDir, outputPath);

  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, buildHtml(htmlTemplate, page, outputPath), 'utf8');
};

const write404Page = (htmlTemplate) => {
  const page = {
    routePath: '',
    title: 'Color Swap | A color gradient puzzle game',
    description: 'Swap two color tiles at a time until the full gradient locks back into place in this browser-based puzzle game.'
  };

  fs.writeFileSync(path.join(docsDir, '404.html'), buildHtml(htmlTemplate, page, '404.html'), 'utf8');
};

const writeRobots = (routes) => {
  const robots = `User-agent: *\nAllow: /\n\nSitemap: ${siteOrigin}/sitemap.xml\n`;
  const sitemapEntries = routes.map(route => `  <url><loc>${getPublicUrl(route.routePath)}</loc></url>`).join('\n');
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries}\n</urlset>\n`;

  fs.writeFileSync(path.join(docsDir, 'robots.txt'), robots, 'utf8');
  fs.writeFileSync(path.join(docsDir, 'sitemap.xml'), sitemap, 'utf8');
};

const main = () => {
  if (!fs.existsSync(baseHtmlPath)) {
    throw new Error(`Missing built HTML at ${baseHtmlPath}`);
  }

  const htmlTemplate = fs.readFileSync(baseHtmlPath, 'utf8');
  const routes = [{
    routePath: '',
    title: 'Color Swap | A color gradient puzzle game',
    description: 'Swap two color tiles at a time until the full gradient locks back into place in this browser-based puzzle game.'
  }, {
    routePath: 'game',
    title: 'Choose a puzzle | Color Swap',
    description: 'Choose a Color Swap puzzle and customize the board size and difficulty before you play.'
  }, {
    routePath: 'win',
    title: 'Puzzle complete | Color Swap',
    description: 'You solved the puzzle. Choose another Color Swap board and keep swapping colors.'
  }, ...boards.flatMap(board => ([
    {
      routePath: `game/${board.slug}`,
      title: `${board.name} | Color Swap`,
      description: `Play "${board.name}" in Color Swap, a shareable color-gradient swap puzzle with locked corners and a hand-built palette.`
    },
    {
      routePath: `games/${board.slug}`,
      title: `${board.name} | Color Swap`,
      description: `Play "${board.name}" in Color Swap, a shareable color-gradient swap puzzle with locked corners and a hand-built palette.`
    }
  ]))];

  routes.forEach(route => writePage(htmlTemplate, route));
  write404Page(htmlTemplate);
  writeRobots(routes);
  fs.writeFileSync(path.join(docsDir, '.nojekyll'), '', 'utf8');
};

main();
