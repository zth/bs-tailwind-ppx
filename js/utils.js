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

    /**
     * Ignore any selector using more than 1 class
     */
    if (classes.length > 2) {
      return;
    }

    let selector = classes[1];

    if (selector) {
      let nodeData = {
        className: selector.replace(cleanNodeNameRegexp, ""),
        rules: {}
      };

      node.nodes.forEach(n => {
        nodeData.rules[n.prop] = n.value;
      });

      return nodeData;
    }
  }
}

async function extractRules(src) {
  return processCss(src).then(res => {
    let rules = {};

    res.root.nodes.forEach(node => {
      let nodeData = extractNodeData(node);

      if (nodeData) {
        if (rules[nodeData.className]) {
          rules[nodeData.className].rules = Object.assign(
            rules[nodeData.className].rules,
            nodeData.rules
          );
        } else {
          rules[nodeData.className] = nodeData;
        }
      }
    });

    return rules;
  });
}

module.exports = {
  processCss,
  extractNodeData,
  extractRules
};
