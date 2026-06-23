module.exports = {
  extend: "@apostrophecms/page-type",
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
};
