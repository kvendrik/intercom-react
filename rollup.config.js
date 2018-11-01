/* eslint-disable import/no-extraneous-dependencies */
import rollupTypescript from 'rollup-plugin-typescript2';
import typescript from 'typescript';
import postcss from 'rollup-plugin-postcss';
import {
  main as mainPath,
  module as modulePath,
  dependencies,
} from './package.json';

export default {
  input: 'Intercom/index.ts',
  output: [
    {
      file: mainPath,
      format: 'cjs',
    },
    {
      file: modulePath,
      format: 'es',
    },
  ],
  external: [...Object.keys(dependencies || {})],
  plugins: [
    rollupTypescript({
      tsconfig: './tsconfig.json',
      typescript,
    }),
    postcss({
      modules: true,
    }),
  ],
};
