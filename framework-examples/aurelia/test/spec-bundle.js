/**
 * Inspired by @AngularClass
 * https://github.com/AngularClass/angular2-webpack-starter
 */

/*
 * When testing with webpack and ES6, we have to do some extra
 * things get testing to work right. Because we are gonna write tests
 * in Babel/TS, we have to compile those as well. That's handled in
 * karma.conf.js with the karma-webpack plugin. This is the entry
 * file for webpack test. Just like webpack will create a bundle.js
 * file for our client, when we run test, it well compile and bundle them
 * all here! Crazy huh. So we need to do some setup
 */
Error.stackTraceLimit = Infinity;

require('aurelia-bootstrapper-webpack');

/*
 * Ok, this is kinda crazy. We can use the the context method on
 * require that webpack created in order to tell webpack
 * what files we actually want to require or import.
 * Below, context will be an function/object with file names as keys.
 * using that regex we are saying look in ./src/app and ./test then find
 * any file that ends with spec.js and get its path. By passing in true
 * we say do this recursively
 */
var testContext = require.context('./unit', true, /\.spec\.(ts|js)$/);

/*
 * get all the files, for each file, call the context function
 * that will require the file and load it up here. Context will
 * loop and require those spec files here
 */
function requireAll(requireContext) {
  return requireContext.keys().map(requireContext);
}

// requires and returns all modules that match
var modules = requireAll(testContext);
