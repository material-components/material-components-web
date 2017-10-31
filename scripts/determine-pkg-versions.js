/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Collects updated packages and compares them with commit messages whose scope corresponds
 * to them between the previous release and HEAD. It then analyzes each commit message to determine the most
 * appropriate version to update each component to. For example, say there have been 4 commits for drawer
 * since the previous release, from most -> least recent:
 *
 * - feat(drawer): Add some functionality
 * - docs(drawer): Update README
 * - refactor(drawer): Change some functionality
 *
 *   BREAKING CHANGE: Something was removed / modified as part of the API.
 * - fix(drawer): Fix bug
 *
 * This script will determine that the *major* version should be bumped, due to the breaking
 * change between the last release and now. If the 2nd commit was removed, it would have determined
 * that the *minor* version should be bumped, since it is a more significant change than the fix. Note that
 * the docs(*) commit would not cause any change, since a documentation change does not constitute a version
 * bump.
 *
 * This script will output each package which has deemed to have been changed, along with its new version
 * and the commit that caused it to change. It will also output the new version for the 'material-components-web'
 * package based off the most significant change type within the subpackages. Additionally, it will write the
 * component/version info to a human-readable text file .new-versions.log within the script's CWD.
 *
 * Caveats:
 * 1) This is to be used as an AID, not as a replacement for human verification.
 * 2) This assumes there is at least one tag in the repo. If not, it will not work.
 *
 * NOTE: This script is no longer used since we switched to lerna fixed mode. It may prove useful again if we switch
 * back to independent mode in the future.
 */

const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');

const AsciiTable = require('ascii-table');
const CliTable = require('cli-table');
const semver = require('semver');

const getUpdatedPkgs = require('./lib/get-updated-pkgs');

const MAGICAL_DELIMITER = `__ENDCOMMIT_${Date.now()}__`;
const COMMIT_MSG_RE = /^(feat|fix|docs|style|refactor|perf|test|chore)\((.+)\):/;
const BREAKING_CHANGE_RE = /^BREAKING\sCHANGE:/;
const GIT_LOG_CMD = `git log --format='%B${MAGICAL_DELIMITER}' $(git rev-list --tags --max-count=1)..HEAD`;
const PKGS_PATH = path.resolve(__dirname, '../packages');
const VersionType = {
  MAJOR: 'major',
  MINOR: 'minor',
  PATCH: 'patch',
};

const updatedPkgs = getUpdatedPkgs();
if (!updatedPkgs.length) {
  console.log('No packages to update');
  process.exit(0);
}

const commitMatches = childProcess
  .execSync(GIT_LOG_CMD)
  .toString()
  .split(MAGICAL_DELIMITER)
  .map((c) => {
    const trimmedCommit = c.trim();
    const m = trimmedCommit.match(COMMIT_MSG_RE);
    return m && {
      commit: trimmedCommit,
      type: m[1],
      scope: m[2],
      hasBreakingChange: trimmedCommit.split('\n').some((l) => BREAKING_CHANGE_RE.test(l)),
    };
  })
  .filter((info) => Boolean(info) && affectsPackage(info.scope));
const componentPkgs = updatedPkgs.filter(({name}) => name.indexOf('@material') === 0);
const mdcPkg = updatedPkgs.find(({name}) => name === 'material-components-web');
const newPkgVersions = collectNewPkgVersions(componentPkgs, commitMatches);
const newMDCVersion = Object.assign(collectMDCVersion(mdcPkg, newPkgVersions), {
  name: 'material-components-web',
  causedByCommit: 'N/A',
});

const allPkgVersions = [newMDCVersion].concat(newPkgVersions);
writeSummaryToScreen(allPkgVersions);
writeSummaryToFile(allPkgVersions);

function affectsPackage(commitScope) {
  return fs.existsSync(path.join(PKGS_PATH, `mdc-${commitScope}`));
}

function collectNewPkgVersions(updatedPkgs, commitInfos) {
  return updatedPkgs.map((p) => {
    const {version, changeType, causedByCommit} = determineVersion(p, commitInfos);
    return {
      name: p.name,
      version,
      changeType,
      causedByCommit,
    };
  });
}

function determineVersion(pkg, commitInfos) {
  const currentVersion = semver.valid(pkg.version);
  if (!currentVersion) {
    throw new Error(
      `Invalid semver version ${pkg.version} for ${pkg.name}. This MUST be fixed before release.`
    );
  }

  return commitInfos.reduce(pickBestVersionInfo(pkg), {
    version: semver.inc(currentVersion, 'patch'),
    changeType: 'patch',
    causedByCommit: '(dependency update - part of packages to be updated but no explicit commits referencing it)',
  });
}

function pickBestVersionInfo(pkg) {
  return (currentBest, commitInfo) => {
    const {version, changeType} = currentBest;
    const pkgComponent = pkg.name.split('/')[1];
    if (commitInfo.scope !== pkgComponent) {
      return currentBest;
    }

    let possibleNewChangeType = changeType;
    if (commitInfo.hasBreakingChange) {
      possibleNewChangeType = semver.major(pkg.version) === 0 ? VersionType.MINOR : VersionType.MAJOR;
    } else if (commitInfo.type === 'feat') {
      possibleNewChangeType = VersionType.MINOR;
    } else if (commitInfo.type === 'docs') {
      // docs would not cause any change, so it should not put its commit message as reason of version bump.
      return currentBest;
    } else {
      // fix, style (refers to coding style), refactor (non-breaking change), chore, ...
      possibleNewChangeType = VersionType.PATCH;
    }
    // Note that we assume that pkg.version is valid by the time we get here.
    const possibleNewVersion = possibleNewChangeType ?
      semver.inc(pkg.version, possibleNewChangeType) : pkg.version;

    if (semver.gt(version, possibleNewVersion)) {
      return currentBest;
    }
    return {
      version: possibleNewVersion,
      changeType: possibleNewChangeType,
      causedByCommit: commitInfo.commit,
    };
  };
}

function collectMDCVersion(mdcPkg, newPkgVersions) {
  const currentVersion = semver.valid(mdcPkg.version);
  if (!currentVersion) {
    throw new Error(
      `Invalid material-components-web version ${mdcPkg.version}. This MUST change before release.`
    );
  }
  const changeTypes = new Set(newPkgVersions.map(({changeType}) => changeType));
  const versionRanks = {
    [VersionType.PATCH]: 0,
    [VersionType.MINOR]: 1,
    [VersionType.MAJOR]: 2,
  };
  const overallChangeTypes = [...changeTypes]
    .sort((ct1, ct2) => versionRanks[ct1] - versionRanks[ct2]);
  const overallChangeType = overallChangeTypes.pop();
  return {
    version: semver.inc(currentVersion, overallChangeType) || '(no update needed)',
    changeType: overallChangeType,
  };
}

function writeSummary(pkgVersions, performWrite) {
  const title = 'New Package Versions';
  const headers = ['Package', 'Version', 'Change Type', 'Associated Commit Subject'];
  const rows = pkgVersions.map(({name, version, changeType, causedByCommit}) => [
    name, version, changeType, causedByCommit.split('\n').shift(),
  ]);

  performWrite(title, headers, rows);
}

function writeSummaryToScreen(pkgVersions) {
  writeSummary(pkgVersions, (title, headers, rows) => {
    const table = new CliTable({
      head: headers,
    });
    table.push(...rows);
    console.log(`*** ${title} ***`);
    console.log(table.toString());
  });
}

function writeSummaryToFile(pkgVersions) {
  writeSummary(pkgVersions, (title, headers, rows) => {
    const table = AsciiTable.factory({
      title,
      heading: headers,
      rows,
    });
    const outFile = path.join(process.cwd(), '.new-versions.log');
    fs.writeFileSync(outFile, table.toString());
    console.log(`*** New Version Data written to ${outFile} ***`);
  });
}
