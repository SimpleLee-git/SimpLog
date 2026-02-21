// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import icon from 'astro-icon';

import { visit } from 'unist-util-visit';
import tailwindcss from '@tailwindcss/vite';
import remarkObsidianCallout from 'remark-obsidian-callout';

/** @type {import('unified').Plugin<[], any>} */
function remarkObsidian() {
  console.log('[remarkObsidian] Plugin started');
  return (/** @type {any} */ tree) => {
    console.log('[remarkObsidian] Walking tree...');
    visit(tree, 'text', (node, index, parent) => {
      if (!node.value || !parent || index === undefined) return;

      if (node.value.includes('[[')) {
        console.log(`[remarkObsidian] Found potential wikilink in: ${node.value.substring(0, 20)}...`);
      }

      // Detect Obsidian Image Embed: ![[image.png|alias]] or ![[image.png]]
      const imageRegex = /!\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
      if (imageRegex.test(node.value)) {
        console.log(`[remarkObsidian] MATCHED IMAGE: ${node.value.trim()}`);
        const parts = node.value.split(imageRegex);
        const newNodes = [];
        // split with 2 groups returns [text, group1, group2, text, ...] -> every 3 elements
        for (let i = 0; i < parts.length; i += 3) {
          if (parts[i]) newNodes.push({ type: 'text', value: parts[i] });
          if (parts[i + 1]) {
            const fileName = parts[i + 1].trim();
            const alt = parts[i + 2] || fileName;
            const isImage = /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(fileName);
            if (isImage) {
              console.log(`[remarkObsidian] Resolving image: ${fileName}`);
              newNodes.push({
                type: 'image',
                url: `./attachments/${fileName}`,
                alt: alt,
                title: null,
              });
            } else {
              newNodes.push({ type: 'text', value: `![[${parts[i + 1]}]]` });
            }
          }
        }
        parent.children.splice(index, 1, ...newNodes);
        return index + newNodes.length;
      }

      // Detect Obsidian Wiki Link: [[link|alias]] or [[link]]
      const linkRegex = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
      if (linkRegex.test(node.value)) {
        console.log(`[remarkObsidian] Found link match: ${node.value}`);
        const parts = node.value.split(linkRegex);
        const newNodes = [];
        for (let i = 0; i < parts.length; i += 3) {
          if (parts[i]) newNodes.push({ type: 'text', value: parts[i] });
          if (parts[i + 1]) {
            const link = parts[i + 1].trim();
            const alias = parts[i + 2] || link;
            newNodes.push({
              type: 'link',
              url: link,
              children: [{ type: 'text', value: alias }],
            });
          }
        }
        parent.children.splice(index, 1, ...newNodes);
        return index + newNodes.length;
      }
    });
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://vineLee.github.io',
  base: '/SimpleLog',
  integrations: [
    mdx({
      remarkPlugins: [remarkObsidian, remarkObsidianCallout],
    }),
    sitemap(),
    icon(),
  ],
  markdown: {
    remarkPlugins: [remarkObsidian, remarkObsidianCallout],
  },
  devToolbar: {
    enabled: false,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});