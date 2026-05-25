// Load .env without external dependencies (no dotenv package required)
(function loadDotEnv() {
  const fs = require("fs");
  const path = require("path");
  try {
    const envPath = path.resolve(__dirname, "../../.env");
    const lines = fs.readFileSync(envPath, "utf-8").split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx < 0) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      if (process.env[key] !== undefined) continue; // system env vars take priority
      let value = trimmed.slice(eqIdx + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  } catch (_) {
    // .env not present — fine in CI / production
  }
})();

module.exports = {
  title: "Steve Roberts",
  tagline: "Code · Support · Geek",
  description:
    "Steve Roberts — Senior Software Engineer in Suffolk, England. Sustainable engineering, automation, media production, gaming, and long-term community projects.",
  url: process.env.SITE_URL || "https://steveroberts.me",
  gaId: process.env.GA_MEASUREMENT_ID || "",
  author: "Steve Roberts",
  location: "Suffolk, England",
  email: "midnitegeek@googlemail.com",
  social: {
    github: "https://github.com/steverobertsuk",
    linkedin: "https://www.linkedin.com/in/geekysteveroberts/",
    holosuite: "https://holosuitemedia.com",
    gaming: "https://midniteshadow.online",
    shadow: "https://shadowcomputers.co.uk",
  },
  nav: [
    { label: "Home", url: "/" },
    { label: "Projects", url: "/projects/" },
    { label: "Experience", url: "/experience/" },
    { label: "Media & Gaming", url: "/media/" },
    { label: "Running", url: "/running/" },
    { label: "Now", url: "/now/" },
    { label: "Contact", url: "/contact/" },
  ],
};
