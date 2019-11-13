let { processCss, extractNodeData, extractRules } = require("../utils");

async function parseAndGetFirstNode(src) {
  let parsed = await processCss(src);
  return parsed.root.nodes[0];
}

describe("Compiler tests", () => {
  describe("processCss", () => {
    it("processes the CSS and returns the result", async () => {
      let css = await processCss(`
            .bg-black-100 {
                background-color: black;
            }
            `);

      expect(css.css).toMatchSnapshot();
    });
  });

  describe("extractNodeData", () => {
    async function extractNode(src) {
      return extractNodeData(await parseAndGetFirstNode(src));
    }

    it("extracts regular class names", async () => {
      let node = await extractNode(".bg-black-100 { background-color: black }");
      expect(node.className).toBe("bg-black-100");
    });

    it("ignores anything with more than 1 class selector", async () => {
      let node = await extractNode(
        ".bg-black-100.bg-hello { background-color: black }"
      );
      expect(node).toBeUndefined();
    });

    it("cleans escaped characters", async () => {
      let node = await extractNode(
        ".focus\\:bg-black-100 { background-color: black }"
      );
      expect(node.className).toBe("focus:bg-black-100");
    });

    it("cleans pseudo selectors", async () => {
      let node = await extractNode(
        ".focus\\:bg-black-100:focus { background-color: black }"
      );

      expect(node.className).toBe("focus:bg-black-100");

      node = await extractNode(
        ".focus\\:bg-black-100:hover { background-color: black }"
      );

      expect(node.className).toBe("focus:bg-black-100");

      node = await extractNode(
        ".bg-black-100::after { background-color: black }"
      );
      expect(node.className).toBe("bg-black-100");
    });

    it("extracts the rules defined by the class", async () => {
      let node = await extractNode(".bg-black-100 { background-color: black }");
      expect(node.rules).toEqual({ "background-color": "black" });

      node = await extractNode(
        ".bg-black-100 { background-color: black; background-attachment: fixed; }"
      );
      expect(node.rules).toEqual({
        "background-color": "black",
        "background-attachment": "fixed"
      });
    });
  });
});
