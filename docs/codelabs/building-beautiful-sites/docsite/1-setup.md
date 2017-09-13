<!--docs:
title: "1. Set up your development environment"
layout: landing
section: codelab
path: /codelab/1-setup/
-->

<!--
This is a simplified version of Building Beautiful Sites with MDC web
edited for a non-technical audience
-->

<link rel="stylesheet" href="css/codelab.css" />

# Set up your development environment

Duration: 5:00
{: .duration}

## Download the starter codelab app

[Download starter app](https://github.com/material-components/material-components-web/archive/master.zip)

> The starter app is located within the `docs/codelabs/building-beautiful-sites/starter directory`. Be sure to `cd` into that directory before beginning.
{: .hint}

## Or clone it from GitHub

```shell
git clone https://github.com/material-components/material-components-web
cd material-components-web/docs/codelabs/building-beautiful-sites/starter
```

> More help: [Cloning a repository from GitHub](https://help.github.com/articles/cloning-a-repository/)
{: .hint}

## Install the project’s dependencies

We will be using [live-server](https://www.npmjs.com/package/live-server) module as our local web development server so we can serve our site as if it were running in a production web application. Live-server automatically updates the web page whenever any HTML, CSS, or JavaScript changes are made. There is no refreshing needed! Live-server is listed as a [devDependency](https://docs.npmjs.com/files/package.json#devdependencies) for this project, which means we can install it using npm.

From the starter directory (it should be your current directory if you follow the above step), run `npm install`. You will see a lot of activity and at the end, the output will show a successful install.

## Run the starter app

Run `npm run dev` in the same directory (starter directory) in which you just ran npm install. The live-server will start. It watches the directory for source code changes and launches a web browser pointing to the page.

> If you were unable to run `npm install` or `npm run dev` successfully, stop and troubleshoot your developer environment.
{: .warning}

Voila! Shrine is running in your browser. You can scroll through the page to see a list of product cards.
