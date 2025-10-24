#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get current date in YYYY-MM-DD format
const currentDate = new Date().toISOString().split('T')[0];

// Read sitemap.xml
const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
let sitemapContent = fs.readFileSync(sitemapPath, 'utf8');

// Update all lastmod dates to current date
sitemapContent = sitemapContent.replace(
  /<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g,
  `<lastmod>${currentDate}</lastmod>`
);

// Write updated sitemap
fs.writeFileSync(sitemapPath, sitemapContent);

// Also update sitemap-index.xml
const sitemapIndexPath = path.join(__dirname, '../public/sitemap-index.xml');
let sitemapIndexContent = fs.readFileSync(sitemapIndexPath, 'utf8');

sitemapIndexContent = sitemapIndexContent.replace(
  /<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g,
  `<lastmod>${currentDate}</lastmod>`
);

fs.writeFileSync(sitemapIndexPath, sitemapIndexContent);

console.log(`✅ Sitemap updated with date: ${currentDate}`);
