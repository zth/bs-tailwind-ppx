open TestFramework;

let makeMockLexingPos = (): Lexing.position => {
  pos_fname: "",
  pos_lnum: 0,
  pos_bol: 0,
  pos_cnum: 0,
};

let makeMockLocObj = (): Ppxlib.Location.t => {
  loc_start: makeMockLexingPos(),
  loc_end: makeMockLexingPos(),
  loc_ghost: false,
};

describe("validating CSS strings", ({test, _}) => {
  test("returns Ok when everything is fine", ({expect}) =>
    expect.result(
      "bg-black text-red-100"
      |> Library.Util.validateCssStr(~loc=makeMockLocObj()),
    ).
      toBeOk()
  );

  test("errors on invalid class names", ({expect}) =>
    expect.fn(() =>
      "bg-blaack text-red-100"
      |> Library.Util.validateCssStr(~loc=makeMockLocObj())
    ).
      toThrow()
  );

  test("errors on duplicate class names", ({expect}) =>
    expect.fn(() =>
      "bg-black bg-black"
      |> Library.Util.validateCssStr(~loc=makeMockLocObj())
    ).
      toThrow()
  );
});