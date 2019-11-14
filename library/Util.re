open Ppxlib;

let errorInCssString = cssStr => {
  let classes = cssStr |> Tablecloth.String.split(~on=" ");

  TailwindData.classNames
  |> List.find_opt(n => !(classes |> List.exists(c => c == n)))
  |> Tablecloth.Option.map(~f=n =>
       Printf.sprintf("\"%s\" is not a valid class name", n)
     );
};

let tcssExtension =
  Extension.declare(
    "tcss",
    Extension.Context.expression,
    Ast_pattern.(single_expr_payload(estring(__))),
    (~loc, ~path as _, cssStr) => {
    switch (errorInCssString(cssStr)) {
    | None => Ast_builder.Default.estring(~loc, cssStr)
    | Some(message) =>
      %expr
      [%ocaml.error [%e Ast_builder.Default.estring(~loc, message)]]
    }
  });

let () = Driver.register_transformation(~extensions=[tcssExtension], "tcss");
