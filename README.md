# bs-tailwind

_Just an experiment, unusable as of now_. Requires BuckleScript 6.

## Idea

A simple PPX (`[%tcss {| bg-fixed bg-red-100 hover:bg-green-100 |}]`) with 0 runtime cost that validates your Tailwind css class usage.

## High-level overview

`bs-tailwind` needs to know about all classes your project can use, including custom classes and classes setup by third parties. Currently it does this by running your `style.css` through Tailwind and outputing a JSON file with all possible class names for your project. The PPX can then use this JSON file to ensure that the right class names are used.

### Outputing the JSON file

The JSON file is created by using `bs-tailwind.js`, which is a small script that mimics how Tailwind's CLI processes your styles, and then extracts all possible classes from there. You run it by giving it the relative path to your `style.css`:
`./bs-tailwind src/css/styles.css`

## Goals

- [x] Validate that no invalid class names are used
- [ ] Validate that no duplicate class names are used
- [ ] Validate that only one class name from a single category (think `bg-`) is used.
- [ ] Validate that necessary dependent/parent classes are used (think classes setting flex properties without using the class `flex`)

## Plan going forward

I won't be able to work on this for a little while, but the plan going forward is as follows:

- [ ] Extend the `bs-tailwind.js` script to properly extract class names (the logic is a bit flawed right now and doesn't account for pseudo-selectors), extract whatever parent the specific class needs, and extract what actual property it's setting (so we can validate that you only have one specific class setting a specific property)
- [ ] Extending the PPX to save the parsed and marshalled `bs-tailwind.json` to a cache directory, and then load that cached output for working with the actual output (copy the logic from `graphql_ppx` which does specifically that)
- [ ] Extend the PPX to implement all validation rules using the generated rules file
- [ ] Ensure proper location reporting if possible

## Developing

### PPX

Since I don't know how to test actual PPX output, the PPX is written in a way that allows you to work on it in a test-driven manner using `Rely`:

```
# Check out TestFile.re
esy test
```

### Node setup script

For now, copy `bs-tailwind.js` to `example/` and run `./bs-tailwind.js src/css/style.css`.
