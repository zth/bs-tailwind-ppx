let tailwind = require("tailwindcss");
let p = require("postcss");

function processCss(src) {
  return p([tailwind()]).process(src, {
    from: "a.css",
    to: "a.out.css"
  });
}

let cleanNodeNameRegexp = new RegExp(
  /(\\)|((:hover|:focus|::after|::before))/g
);

function extractNodeData(node) {
  if (node.type === "rule" && node.selector.startsWith(".")) {
    let classes = node.selector.split(".");

    if (classes.length > 2) {
      return;
    }

    let selector = classes[1];

    if (selector) {
      return selector.replace(cleanNodeNameRegexp, "");
    }
  }
}

module.exports = {
  processCss,
  extractNodeData
};
