const fs = require('node:fs');
const path = require('node:path');

const envFile = path.join(__dirname, '.env');
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed
      .slice(eq + 1)
      .trim()
      .replace(/^["']|["']$/g, '');
    if (key && !(key in process.env)) process.env[key] = val;
  }
}

module.exports = function eleventyConfig(eleventyConfig) {
  eleventyConfig.addPassthroughCopy(
    { 'src/assets': 'assets' },
    {
      filter: function (path) {
        const base = path.split(/[\\/]/).pop();
        return !base.startsWith('_');
      },
    },
  );
  eleventyConfig.addPassthroughCopy({ 'src/favicon.svg': 'favicon.svg' });
  eleventyConfig.addPassthroughCopy({ 'src/robots.txt': 'robots.txt' });

  eleventyConfig.addShortcode('year', function () {
    return String(new Date().getFullYear());
  });

  return {
    dir: {
      input: 'src',
      includes: '_includes',
      data: '_data',
      output: '_site',
    },
    templateFormats: ['njk', 'md', 'html'],
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
  };
};
