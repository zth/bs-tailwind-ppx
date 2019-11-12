open Ppxlib;

let validateCssStr = (~loc, cssStr) => {
  let classes = cssStr |> Tablecloth.String.split(~on=" ");

  TailwindData.classNames
  |> List.iteri((i, n) =>
       switch (classes |> List.find_opt(c => c == n)) {
       | Some(_) => ()
       | None => Location.raise_errorf("\"%s\" is not a valid class name", n)
       }
     );

  Tablecloth.Result.(Ok());
};

let extractCssStr = (~loc, ~expr) =>
  switch (expr) {
  | PStr([
      {
        pstr_desc:
          [@implicit_arity]
          Pstr_eval(
            {
              pexp_loc: loc,
              pexp_desc:
                Pexp_constant([@implicit_arity] Pconst_string(cssStr, _)),
              _,
            },
            _,
          ),
        _,
      },
    ]) => (
      cssStr,
      loc,
    )
  | _ => Location.raise_errorf(~loc, "[%%tcss] must be provided a string.")
  };

let tcssExtension =
  Extension.declare(
    "tcss",
    Extension.Context.expression,
    Ast_pattern.__,
    (~loc as rootLoc, ~path as _, expr) => {
      let (cssStr, loc) = extractCssStr(~loc=rootLoc, ~expr);

      switch (cssStr |> validateCssStr(~loc)) {
      | Ok () => ()
      | Error(message) => Location.raise_errorf(~loc, message)
      };

      {
        pexp_attributes: [],
        pexp_loc: loc,
        pexp_loc_stack: [loc],
        pexp_desc:
          Pexp_constant([@implicit_arity] Pconst_string(cssStr, None)),
      };
    },
  );

let () = Driver.register_transformation(~extensions=[tcssExtension], "tcss");