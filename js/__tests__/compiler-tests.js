let { processCss, extractNodeData } = require("../utils");

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
      expect(
        await extractNode(".bg-black-100 { background-color: black }")
      ).toBe("bg-black-100");
    });

    it("ignores anything with more than 1 class selector", async () => {
      expect(
        await extractNode(".bg-black-100.bg-hello { background-color: black }")
      ).toBeUndefined();
    });

    it("cleans escaped characters", async () => {
      expect(
        await extractNode(".focus\\:bg-black-100 { background-color: black }")
      ).toBe("focus:bg-black-100");
    });

    it("cleans pseudo selectors", async () => {
      expect(
        await extractNode(
          ".focus\\:bg-black-100:focus { background-color: black }"
        )
      ).toBe("focus:bg-black-100");
      expect(
        await extractNode(
          ".focus\\:bg-black-100:hover { background-color: black }"
        )
      ).toBe("focus:bg-black-100");
      expect(
        await extractNode(".bg-black-100::after { background-color: black }")
      ).toBe("bg-black-100");
    });
  });
});
