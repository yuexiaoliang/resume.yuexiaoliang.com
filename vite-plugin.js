import { resolve } from 'path';
import fs from 'fs-extra';
import { createFilter } from '@rollup/pluginutils';
import { minify as minifyHtml } from 'html-minifier-terser';

import { createMarkdownIt, pdfBuilder, __dirname } from './core';

export default function plugin(options = {}) {
  const { pdfName, webTitle, markdown, pdfMargin } = options;

  return {
    name: 'build',
    enforce: 'post',

    transformIndexHtml(html) {
      const md = createMarkdownIt(markdown);
      const readme = fs.readFileSync(resolve(__dirname, '../src/resume.md')).toString();

      return html.replace('#[title]', webTitle || pdfName || 'resume').replace('#[content]', md.render(readme));
    },

    transform(val, id) {
      const filter = createFilter(['**/*.md']);
      if (!filter(id)) return null;

      return {
        code: `export default ${JSON.stringify(val)};`
      };
    },

    async generateBundle(_, bundle) {
      for (const info of Object.values(bundle)) {
        const filter = createFilter(['**/*.html']);
        if (info.type === 'asset' && filter(info.fileName) && typeof info.source === 'string') {
          info.source = await minifyHtml(info.source, {
            collapseWhitespace: true,
            keepClosingSlash: true,
            removeComments: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            useShortDoctype: true,
            trueCSS: true
          });
        }
      }

      pdfBuilder({
        name: pdfName,
        margin: pdfMargin
      });
    }
  };
}
