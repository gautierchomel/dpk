require("apostrophe")({
  shortName: "dpk-cms",
  adminBar: {
    groups: [
      {
        label: "Content",
        items: ["article", "article-page", "default-page"],
      },
    ],
  },
  modules: {
    "@apostrophecms/db": {
      uri: process.env.APOS_MONGODB_URI || "mongodb://127.0.0.1:27017/dpk-cms",
    },
    "@apostrophecms/express": {
      port: Number(process.env.APOS_PORT || 3000),
    },
    "@apostrophecms/home-page": {
      fields: {
        add: {
          main: {
            type: "area",
            options: {
              widgets: {
                "@apostrophecms/rich-text": {},
              },
            },
          },
        },
      },
    },
    "@apostrophecms/global": {
      fields: {
        add: {
          siteTitle: {
            type: "string",
            label: "Site Title",
            def: "DPK",
          },
        },
      },
    },
    "default-page": {},
    "article": {},
    "article-page": {},
  },
});
