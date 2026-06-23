import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import apostrophe from "@apostrophecms/apostrophe-astro";

export default defineConfig({
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  integrations: [
    apostrophe({
      aposHost: process.env.APOS_HOST || "http://localhost:3000",
      widgetsMapping: "./src/widgets",
      templatesMapping: "./src/templates",
      viewTransitionWorkaround: false,
      includeResponseHeaders: [
        "content-security-policy",
        "strict-transport-security",
        "x-frame-options",
        "referrer-policy",
        "cache-control",
      ],
      excludeRequestHeaders: ["host"],
    }),
  ],
  vite: {
    ssr: {
      noExternal: ["@apostrophecms/apostrophe-astro"],
    },
  },
});
