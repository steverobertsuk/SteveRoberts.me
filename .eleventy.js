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
