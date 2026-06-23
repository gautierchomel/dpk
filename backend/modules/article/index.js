module.exports = {
  extend: "@apostrophecms/piece-type",
  options: {
    label: "Article",
    pluralLabel: "Articles",
    publicApiProjection: {
      title: 1,
      slug: 1,
      excerpt: 1,
      body: 1,
      _url: 1,
    },
  },
  fields: {
    add: {
      excerpt: {
        type: "string",
        textarea: true,
        max: 280,
      },
      body: {
        type: "area",
        options: {
          widgets: {
            "@apostrophecms/rich-text": {},
          },
        },
      },
    },
    group: {
      basics: {
        fields: ["title", "excerpt", "body", "_published"],
      },
    },
  },
};
