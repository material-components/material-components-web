/**
 * Copyright 2016 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const webpack = require('webpack');
const path = require('path');
const OUT_PATH = path.resolve('./dist');
const MDC_DIR = path.resolve(__dirname, 'node_modules', '@material');

const CSS_LOADER_CONFIG = [
	{
		loader: 'css-loader',
		options: {
			sourceMap: true
		}
	},
	{
		loader: 'postcss-loader',
		options: {
			plugins: () => [require('autoprefixer')({ grid: false })]
		}
	},
	{
		loader: 'sass-loader',
		options: {
			sourceMap: true,
			includePaths: path.join(__dirname, "sass")
		}
	}
];

module.exports =
	[
		{
			devtool: 'source-map',
			cache: true,
			output: {
				path: OUT_PATH,
				filename: '[name].bundle.js'
			},
			entry: {
				'polyfills': './src/polyfills.ts',
				'vendor': './src/vendor.ts',
				'app': './src/root.module.ts'
			},
			resolve: {
				extensions: ['.ts', '.js']
			},
			module: {
				rules: [
					{
						test: /\.ts$/,
						use: [
							{
								loader: 'babel-loader'
							},
							{
								loader: 'awesome-typescript-loader',
								options: {
									configFileName: 'tsconfig.json'
								}
							},
							{
								loader: 'angular2-template-loader'
							}
						],
						exclude: [/\.(spec|e2e)\.ts$/]
					},
					{
						test: /\.js$/,
						loader: 'babel-loader',
						include: [
							MDC_DIR
						]
					},
					{
						test: /\.html$/,
						loader: 'html-loader'
					},
					{
						test: /\.(sass|scss)$/,
						use: [
							'style-loader',
							'css-loader',
							{
								loader: 'sass-loader',
								options: {
									includePaths: [
										'node_modules'
									]
								},
							},
						]
					}
				]
			},
			plugins: [
				// Workaround for angular/angular#11580
				new webpack.ContextReplacementPlugin(
					/angular(\\|\/)core(\\|\/)@angular/,
					path.resolve(__dirname, './ts')
				),
				new webpack.optimize.CommonsChunkPlugin({
					name: ['app', 'vendor', 'polyfills'], minChunks: Infinity
				})
			]
		}
	];