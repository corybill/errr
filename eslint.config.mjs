import { defineConfig } from "eslint/config";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default defineConfig([{
  extends: compat.extends("eslint:recommended"),

  languageOptions: {
    globals: {
      ...globals.node,
      ...globals.mocha,
      expect: "readonly",
    },

    ecmaVersion: 2022,
    sourceType: "module",
  },

  rules: {
    "indent": [2, 2, {
      SwitchCase: 1,
    }],

    "quotes": [2, "double"],
    "linebreak-style": [2, "unix"],
    "semi": [2, "always"],
    "no-extra-parens": [2, "functions"],
    "no-unexpected-multiline": [2],
    "valid-jsdoc": [0],
    "accessor-pairs": [0],
    "block-scoped-var": [2],
    "complexity": [0],
    "consistent-return": [2],
    "curly": [2, "all"],
    "default-case": [2],
    "dot-notation": [2],
    "dot-location": [2, "property"],
    "eqeqeq": [2, "smart"],
    "guard-for-in": [2],
    "no-alert": [2],
    "no-caller": [2],
    "no-div-regex": [0],
    "no-else-return": [0],
    "no-eq-null": [2],
    "no-eval": [2],
    "no-extend-native": [2],
    "no-extra-bind": [2],
    "no-fallthrough": [2],
    "no-floating-decimal": [2],
    "no-implicit-coercion": [0],
    "no-implied-eval": [2],
    "no-invalid-this": [0],
    "no-iterator": [2],
    "no-labels": [2],
    "no-lone-blocks": [2],
    "no-loop-func": [2],
    "no-multi-spaces": [2],
    "no-multi-str": [2],
    "no-native-reassign": [2],
    "no-new-func": [2],
    "no-new-wrappers": [0],
    "no-new": [2],
    "no-octal-escape": [2],
    "no-octal": [2],

    "no-param-reassign": [0, {
      props: false,
    }],

    "no-process-env": [0],
    "no-proto": [2],

    "no-redeclare": [2, {
      builtinGlobals: true,
    }],

    "no-return-assign": [0],
    "no-script-url": [2],
    "no-self-compare": [2],
    "no-sequences": [2],
    "no-throw-literal": [1],
    "no-unused-expressions": [2],
    "no-useless-call": [2],
    "no-useless-concat": [2],
    "no-void": [2],

    "no-warning-comments": [0, {
      terms: ["todo", "fixme"],
      location: "start",
    }],

    "no-with": [2],
    "radix": [2],
    "vars-on-top": [0],
    "wrap-iife": [2],
    "yoda": [0, "never"],
    "init-declarations": [0],
    "no-catch-shadow": [0],
    "no-delete-var": [2],
    "no-label-var": [2],
    "no-shadow-restricted-names": [2],
    "no-shadow": [2],
    "no-undef-init": [2],
    "no-undef": [2],
    "no-undefined": [0],
    "no-unused-vars": [2],
    "no-use-before-define": [2, "nofunc"],
    "callback-return": [2, ["callback", "cb", "next"]],
    "handle-callback-err": [2, "^(err\\d?|error\\d?|^.+Err$|^.+Error$)$"],
    "no-mixed-requires": [2, false],
    "no-new-require": [2],
    "no-path-concat": [2],
    "no-process-exit": [0],
    "no-restricted-modules": [0],
    "no-sync": [2],
    "array-bracket-spacing": [2, "never"],
    "block-spacing": [2, "never"],

    "brace-style": [2, "1tbs", {
      allowSingleLine: true,
    }],

    "camelcase": [2, {
      properties: "always",
    }],

    "comma-spacing": [2, {
      before: false,
      after: true,
    }],

    "comma-style": [2, "last"],
    "computed-property-spacing": [2, "never"],
    "consistent-this": [2, "self"],
    "eol-last": [2],
    "func-names": [0],
    "func-style": [2, "declaration"],

    "id-length": [2, {
      min: 3,
      properties: "never",
      exceptions: ["Q", "q", "_", "cb", "id", "i", "j"],
    }],

    "id-match": [0],

    "key-spacing": [2, {
      beforeColon: false,
      afterColon: true,
    }],

    "keyword-spacing": [2, {}],
    "lines-around-comment": [0],
    "max-nested-callbacks": [2, 6],

    "new-cap": [2, {
      capIsNewExceptions: ["Router"],
    }],

    "new-parens": [2],
    "newline-after-var": [2, "always"],
    "no-array-constructor": [2],
    "no-continue": [2],
    "no-inline-comments": [0],
    "no-lonely-if": [0],
    "no-mixed-spaces-and-tabs": [2],

    "no-multiple-empty-lines": [2, {
      max: 1,
    }],

    "no-nested-ternary": [2],
    "no-new-object": [2],
    "no-spaced-func": [2],
    "no-ternary": [0],

    "no-trailing-spaces": [2, {
      skipBlankLines: true,
    }],

    "no-underscore-dangle": [0],
    "no-unneeded-ternary": [2],
    "object-curly-spacing": [2, "always"],
    "one-var": [0],
    "operator-assignment": [0],
    "operator-linebreak": [2, "after"],
    "padded-blocks": [0, "never"],
    "quote-props": [2, "consistent"],

    "semi-spacing": [2, {
      before: false,
      after: true,
    }],

    "sort-vars": [0],
    "space-before-blocks": [2, "always"],

    "space-before-function-paren": [2, {
      anonymous: "always",
      named: "never",
    }],

    "space-in-parens": [2, "never"],

    "space-infix-ops": [2, {
      int32Hint: false,
    }],

    "space-return-throw-case": [0],

    "space-unary-ops": [2, {
      words: true,
      nonwords: false,
    }],

    "spaced-comment": [2, "always"],
    "wrap-regex": [2],
  },
}]);
