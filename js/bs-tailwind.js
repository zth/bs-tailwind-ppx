#!/usr/bin/env node
let p = require("postcss");
let fs = require("fs");
let tailwind = require("tailwindcss");
let path = require("path");
let { processCss, extractNodeData, extractRules } = require("./utils");

let src = fs.readFileSync(process.argv[2]);

extractRules(src).then(rules => {
  fs.writeFileSync("./bs-tailwind.json", JSON.stringify(rules));
});
