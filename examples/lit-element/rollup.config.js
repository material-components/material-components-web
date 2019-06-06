import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript';
import sass from 'rollup-plugin-sass';
import serve from 'rollup-plugin-serve'

const getStyleConfig = (name) => {
  return {
    input: `src/components/${name}/index.scss`,
    output: {
      name: 'null',
      file: '/tmp/__rollup_tmp_null',
      format: 'esm',
    },
    plugins: [
      sass({
        output: `src/components/${name}/${name}.style.ts`,
        options: {
          includePaths: ['node_modules']
        },
        processor: css => {
          return `export const style = \`${css}\`;`;
        },
      }),
    ],
  };
}

const styleConfig = [
  getStyleConfig('button'),
  getStyleConfig('textfield')
];

const componentsConfig = {
	input: 'src/index.ts',
	output: {
		file: 'public/bundle.js',
		format: 'esm',
		sourcemap: true,
	},
	plugins: [
    typescript(),
		resolve(),
    commonjs(),
    serve('public'),
	]
};

console.log([...styleConfig, componentsConfig]);

export default [...styleConfig, componentsConfig];
