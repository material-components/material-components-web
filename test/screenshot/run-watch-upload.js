const {createHash} = require('crypto');
const {Readable} = require('stream');
const {readFile, writeFile} = require('fs');
const {promisify} = require('util');

const chokidar = require('chokidar');
const debounce = require('debounce');
const git = require('simple-git/promise');
const Storage = require('@google-cloud/storage');

const readFilePromise = promisify(readFile);
const writeFilePromise = promisify(writeFile);

const WAIT_MS = 250;
const GCLOUD_SERVICE_ACCOUNT_KEY_FILE_PATH = process.env.MDC_GCLOUD_SERVICE_ACCOUNT_KEY_FILE_PATH;
const GCLOUD_STORAGE_BUCKET_NAME = 'mdc-web-screenshot-tests';
const LOCAL_DIRECTORY_PREFIX = 'test/screenshot/';

const gitRepo = git();
const fileQueue = new Map();
const notifyDebounce = debounce(notify, WAIT_MS);
const storage = new Storage({
  credentials: require(GCLOUD_SERVICE_ACCOUNT_KEY_FILE_PATH),
});
const bucket = storage.bucket(GCLOUD_STORAGE_BUCKET_NAME);

const watcher = chokidar.watch(
  [
    'test/screenshot/out/',
    'test/screenshot/**/*.html',
  ],
  {
    awaitWriteFinish: {
      stabilityThreshold: WAIT_MS,
    },
  }
);

watcher
  .on('add', add)
  .on('change', change)
  .on('unlink', remove);

async function add(path) {
  fileQueue.set(path, await readFilePromise(path, {encoding: 'utf8'}));
  notifyDebounce();
}

// TODO(acdvorak): Keep track of file content hashes and ignore "change" events that don't alter file contents
async function change(path) {
  fileQueue.set(path, await readFilePromise(path, {encoding: 'utf8'}));
  notifyDebounce();
}

function remove(path) {
  fileQueue.delete(path);
  notifyDebounce();
}

async function notify() {
  const gitDiffOutput = (await gitRepo.diff(['HEAD'])).trim();
  const gitBaseCommit = (await gitRepo.revparse(['--short', 'HEAD'])).trim();
  const gitBranchName = (await gitRepo.revparse(['--abbrev-ref', 'HEAD'])).trim();
  const gitUntrackedFilePaths = (await gitRepo.raw(['ls-files', '--others', '--exclude-standard'])).trim().split('\n');

  console.log('gitUntrackedFilePaths:', gitUntrackedFilePaths);

  const gitUntrackedFileContents = await Promise.all(
    gitUntrackedFilePaths.map((untrackedFilePath) => readFilePromise(untrackedFilePath, {encoding: 'utf8'}))
  );
  const gitDiffHash = shortHash(gitDiffOutput + gitUntrackedFileContents.join('\n'));

  const files = new Map(fileQueue);
  fileQueue.clear();

  const metadata = {
    git_base_commit: gitBaseCommit,
    git_branch_name: gitBranchName,
    git_diff_hash: gitDiffHash,
  };

  const promises = [];

  files.forEach(async (fileContents, localFilePath) => {
    const relativeFilePath = localFilePath.replace(LOCAL_DIRECTORY_PREFIX, '');
    const gcsFilePath = `commit/${gitBaseCommit}/${gitDiffHash}/static/${relativeFilePath}`;

    console.log(gcsFilePath);

    const file = bucket.file(gcsFilePath);
    const [exists] = await file.exists();
    if (exists) {
      console.log('✔︎ No changes to', gcsFilePath);
      return;
    }

    const stream = new Readable();
    stream.push(fileContents);
    stream.push(null);

    promises.push(
      new Promise((resolve, reject) => {
        stream.pipe(file.createWriteStream())
          .on('error', (err) => {
            reject(err);
          })
          .on('finish', async () => {
            try {
              await file.makePublic();
              await file.setMetadata({metadata});
              console.log('✔︎ Uploaded', gcsFilePath);
              resolve();
            } catch (err) {
              reject(err);
            }
          });
      })
    );
  });

  return Promise.all(promises);
}

function shortHash(data) {
  return createHash('sha256').update(data).digest('hex').substr(0, 8);
}
