const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItKatex = require("@vscode/markdown-it-katex").default;

module.exports = function (eleventyConfig) {
  // ---- Plugins ----
  eleventyConfig.addPlugin(syntaxHighlight);

  // ---- Markdown-it setup (KaTeX for inline/block math, anchors for headings) ----
  const md = markdownIt({
    html: true,
    breaks: false,
    linkify: true,
    typographer: true,
  })
    .use(markdownItKatex, {
      throwOnError: false,
      strict: false,
    })
    .use(markdownItAnchor, {
      permalink: markdownItAnchor.permalink.headerLink(),
    });

  eleventyConfig.setLibrary("md", md);

  // ---- Passthrough copy for static assets ----
  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addPassthroughCopy("src/assets/js");
  eleventyConfig.addPassthroughCopy("src/assets/images");

  // ---- Watch CSS/JS for live reload during `serve` ----
  eleventyConfig.addWatchTarget("src/assets/css");
  eleventyConfig.addWatchTarget("src/assets/js");

  // ---- Global data: current year (for footer copyright) ----
  eleventyConfig.addGlobalData("currentYear", () => new Date().getFullYear());

  // ---- Date filters ----
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return new Date(dateObj).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  eleventyConfig.addFilter("isoDate", (dateObj) => {
    return new Date(dateObj).toISOString();
  });

  // RFC 3339 timestamp for the Atom feed (same as ISO 8601 here).
  eleventyConfig.addFilter("rfc3339", (dateObj) => {
    return new Date(dateObj).toISOString();
  });

  // Estimate reading time from rendered HTML content (~200 words/min).
  eleventyConfig.addFilter("readingTime", (htmlContent) => {
    const text = String(htmlContent).replace(/<[^>]+>/g, " ");
    const words = text.split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.round(words / 200));
    return `${minutes} min read`;
  });

  // Zero-pad a number to 2 digits, e.g. 3 -> "03" (used for article index numbers)
  eleventyConfig.addFilter("pad2", (num) => {
    return String(num).padStart(2, "0");
  });

  // Slice the first N items from an array (collections.articles, etc.)
  eleventyConfig.addFilter("limit", (arr, n) => {
    return arr.slice(0, n);
  });

  // ---- Articles collection: all markdown files in src/articles, newest first ----
  eleventyConfig.addCollection("articles", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/articles/*.md").sort((a, b) => {
      return b.date - a.date; // newest first
    });
  });

  // ---- Distinct content tags (excludes the internal "articles" tag) ----
  eleventyConfig.addCollection("tagList", (collectionApi) => {
    const tags = new Set();
    collectionApi.getFilteredByGlob("src/articles/*.md").forEach((item) => {
      (item.data.tags || []).forEach((tag) => {
        if (tag !== "articles") tags.add(tag);
      });
    });
    return [...tags].sort();
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["md", "njk", "html"],
    pathPrefix: "/",
  };
};
