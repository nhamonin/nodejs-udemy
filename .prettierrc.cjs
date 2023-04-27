// @ts-check
/// <reference types="@prettier/plugin-pug/src/prettier" />

/**
 * @type {import('prettier').Options}
 */
module.exports = {
  plugins: [require.resolve('@prettier/plugin-pug')],

  printWidth: 120,
  singleQuote: true,

  pugSingleQuote: false,
};
