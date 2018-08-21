/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * @fileoverview Identifies and cherry-picks commits that are not features and do not contain breaking changes.
 *
 * Defaults to operating against the latest non-pre-release tag, but a tag can be specified via command-line argument.
 * This will automatically attempt to cherry-pick appropriate commits since the tag, but will abort and skip any
 * cherry-picks that result in conflicts.
 *
 * Note that this does not create a branch - you will be in detached HEAD state. You can create a branch afterwards
 * if you want, via `git checkout -b <branchname>`.
 */

const args = process.argv.slice(2);

const parser = require('conventional-commits-parser');
const parserOpts = require('conventional-changelog-angular/parser-opts');
const simpleGit = require('simple-git/promise')();
const {spawnSync} = require('child_process');

const CONFLICT_MESSAGE = 'after resolving the conflicts, mark the corrected paths';

// Resolves to the most recent non-pre-release git tag.
async function getMostRecentTag() {
  const tags = await simpleGit.tags();
  // Filter old independent-versioned tags and pre-releases
  const filteredTags = tags.all.filter((tag) => /^v/.test(tag) && !/-/.test(tag));
  return filteredTags[filteredTags.length - 1];
}

// Resolves to an array of commits after the given tag, from earliest to latest (for proper cherry-picking).
async function getCommitsAfterTag(tag) {
  if (!args.includes('--no-fetch')) {
    await simpleGit.fetch();
  }
  const log = await simpleGit.log({
    from: tag,
    to: 'origin/master',
    // simple-git defaults to only including subject + tag/branch (%s%d) in message, which adds noise and is not useful
    // for finding BREAKING CHANGEs (which are in body, %b).
    format: {
      hash: '%H', // Contains full hash only, for cherry-picking
      message: '%s\n\n%b', // Contains subject + body for passing to conventional-commits-parser
      oneline: '%h %s', // Contains abbreviated hash + subject for summary lists
    },
    // Use a splitter that is very unlikely to be included in commit descriptions
    splitter: ';;;',
  });
  return log.all.reverse();
}

// Returns true if commit should NOT be cherry-picked.
function shouldSkipCommit(logLine) {
  const parsedCommit = parser.sync(logLine.message, parserOpts);
  return parsedCommit.type === 'feat' || // feature commit
    parsedCommit.notes.find((note) => note.title === 'BREAKING CHANGE') || // breaking change commit
    (parsedCommit.type === 'chore' && parsedCommit.subject === 'Publish'); // Publish (version-rev) commit
}

// Checks out the given tag and attempts to cherry-pick each commit in the list against it.
// If a conflict is encountered, that cherry-pick is aborted and processing moves on to the next commit.
async function attemptCherryPicks(tag, list) {
  const results = {
    successful: [],
    conflicted: [],
    skipped: [],
  };

  console.log(`Checking out ${tag}`);
  await simpleGit.checkout([tag]);

  for (const logLine of list) {
    if (shouldSkipCommit(logLine)) {
      results.skipped.push(logLine);
      continue;
    }

    try {
      await simpleGit.raw(['cherry-pick', '-x', logLine.hash]);
      results.successful.push(logLine);
    } catch (e) {
      // Detect conflicted cherry-picks and abort them (e.message contains the command's output)
      if (e.message.includes(CONFLICT_MESSAGE)) {
        results.conflicted.push(logLine);
        await simpleGit.raw(['cherry-pick', '--abort']);
      } else {
        console.error(`${logLine.hash} unexpected failure!`, e);
      }
    }
  }

  return results;
}

// Given a string containing a command and arguments, runs the command and returns true if it exits successfully.
// The command's I/O is piped through to the parent process intentionally to be visible in the console.
function checkSpawnSuccess(command) {
  // spawn expects a command and a separate array containing each argument
  const parts = command.split(' ');
  return spawnSync(parts[0], parts.slice(1), {stdio: 'inherit'}).status === 0;
}

// Given a simple-git log line object, outputs the commit's hash and subject on a single line.
function logSingleLineCommit(logLine) {
  console.log(`- ${logLine.oneline}`);
}

async function run() {
  const tag = args.find((arg) => arg[0] === 'v') || await getMostRecentTag();
  const list = await getCommitsAfterTag(tag);
  console.log(`Found ${list.length} commits after tag ${tag}`);

  const results = await attemptCherryPicks(tag, list);

  console.log('');
  console.log('Test-running build...');
  const buildSucceeded = checkSpawnSuccess('npm run build');

  console.log('');
  console.log('Running unit tests...');
  const testsSucceeded = checkSpawnSuccess('npm run test:unit');

  console.log('');
  console.log('Finished!');
  console.log(`Commits intentionally skipped: ............ ${results.skipped.length}`);
  console.log(`Commits cherry-picked: .................... ${results.successful.length}`);
  console.log(`Commits not cherry-picked due to conflicts: ${results.conflicted.length}`);

  if (results.skipped.length) {
    console.log('');
    console.log('Commits skipped:');
    results.skipped.forEach(logSingleLineCommit);
  }

  if (results.conflicted.length) {
    console.log('');
    console.log('Commits with conflicts:');
    results.conflicted.forEach(logSingleLineCommit);
    console.log('Please examine these and cherry-pick manually if appropriate.');
    console.log('(git cherry-pick -x <hash>, then resolve conflicts, then git cherry-pick --continue)');
  }

  console.log('');
  console.log(`Build status: ${buildSucceeded ? 'Success!' : 'FAIL (see above for errors)'}`);
  console.log(`Unit tests status: ${testsSucceeded ? 'Success!' : 'FAIL (see above for failures)'}`);

  console.log('');
  console.log('Please review `git log` to make sure there are no commits dependent on omitted feature commits.');
  console.log('You are now on a detached HEAD. If you want to create a local branch, use git checkout -b <branchname>');
}

run();
