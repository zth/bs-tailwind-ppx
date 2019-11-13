#!/usr/bin/env node
let p = require("postcss");
let fs = require("fs");
let tailwind = require("tailwindcss");
let path = require("path");
let { processCss, extractNodeData } = require("./utils");

let src = fs.readFileSync(process.argv[2]);

let rules = [];

processCss(src).then(res => {
  res.root.nodes.forEach(node => {
    let nodeData = extractNodeData(node);
    if (nodeData) {
      rules.push(nodeData);
    }
  });

  fs.writeFileSync("./bs-tailwind.json", JSON.stringify(rules));
});
