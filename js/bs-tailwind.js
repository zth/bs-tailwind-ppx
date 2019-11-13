#!/usr/bin/env node
let p = require("postcss");
let fs = require("fs");
let tailwind = require("tailwindcss");
let path = require("path");

let src = fs.readFileSync(process.argv[2]);

let rules = [];

p([tailwind()])
  .process(src, {
    from: "a.css",
    to: "a.out.css"
  })
  .then(res => {
    res.root.nodes.forEach(node => {
      if (node.type === "rule" && node.selector.startsWith(".")) {
        rules.push(node.selector.slice(1).replace(/\\/g, ""));
      }
    });

    fs.writeFileSync("./bs-tailwind.json", JSON.stringify(rules));
  });
