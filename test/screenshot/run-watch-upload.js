const {createHash} = require('crypto');
const {Readable} = require('stream');
const {readFile, writeFile} = require('fs');
const {promisify} = require('util');

const chokidar = require('chokidar');
const debounce = require('debounce');
const git = require('simple-git/promise');
const mimeTypes = require('mime-types');
const Storage = require('@google-cloud/storage');

const readFilePromise = promisify(readFile);
const writeFilePromise = promisify(writeFile);

const WAIT_MS = 250;
const GCLOUD_SERVICE_ACCOUNT_KEY_FILE_PATH = process.env.MDC_GCLOUD_SERVICE_ACCOUNT_KEY_FILE_PATH;
const GCLOUD_STORAGE_BUCKET_NAME = 'mdc-web-screenshot-tests';
const GCLOUD_STORAGE_BASE_URL = `https://storage.googleapis.com/${GCLOUD_STORAGE_BUCKET_NAME}/`;
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

async function gitCmd(cmd, argList = []) {
  return (await gitRepo[cmd](argList) || '').trim();
}

async function add(path) {
  fileQueue.set(path, await readFilePromise(path, {encoding: 'utf8'}));
  notifyDebounce();
}

// TODO(acdvorak): Keep track of file content hashes and ignore "change" events that don't alter file contents.
// TODO(acdvorak): Handle filesystem changes in the middle of an upload
// TODO(acdvorak): Detect when user switches git branches, commits, merges, etc. (whenever HEAD ref changes)
async function change(path) {
  fileQueue.set(path, await readFilePromise(path, {encoding: 'utf8'}));
  notifyDebounce();
}

function remove(path) {
  fileQueue.delete(path);
  notifyDebounce();
}

async function notify() {
  const gitDiffOutput = await gitCmd('diff', ['HEAD']);
  const gitBaseCommit = await gitCmd('revparse', ['--short', 'HEAD']);
  const gitBranchName = await gitCmd('revparse', ['--abbrev-ref', 'HEAD']);
  const gitAddedFiles = await gitCmd('raw', ['ls-files', '--others', '--exclude-standard']);

  console.log('gitAddedFiles:', (gitAddedFiles || '(none)'));

  const hashables = [];

  // Tracked files were modified
  if (gitDiffOutput) {
    hashables.push(gitDiffOutput);
  }

  // Untracked files were added
  if (gitAddedFiles) {
    const untrackedFileReadPromises = gitAddedFiles.split('\n').map((untrackedFilePath) => {
      return readFilePromise(untrackedFilePath, {encoding: 'utf8'})
    });
    const untrackedFileContentsConcat = (await Promise.all(untrackedFileReadPromises)).join('\n');
    hashables.push(untrackedFileContentsConcat)
  }

  let gitDiffHash;
  let username;
  if (hashables.length > 0) {
    gitDiffHash = shortHash(hashables.join('\n'));
    username = process.env.USER || process.env.USERNAME;
  } else {
    gitDiffHash = 'unmodified';
    username = 'unmodified';
  }

  const files = new Map(fileQueue);
  fileQueue.clear();

  const customMetadata = {
    'X-MDC-Git-Base-Commit': gitBaseCommit,
    'X-MDC-Git-Branch-Name': gitBranchName,
    'X-MDC-Git-Diff-Hash': gitDiffHash,
  };

  const promises = [];

  files.forEach(async (fileContents, localFilePath) => {
    const relativeFilePath = localFilePath.replace(LOCAL_DIRECTORY_PREFIX, '');
    const gcsFilePath = `base-commit/${gitBaseCommit}/${gitDiffHash || username}/static/${relativeFilePath}`;

    console.log(gcsFilePath);

    const file = bucket.file(gcsFilePath);

    // TODO(acdvorak): Document `gsutil versioning set on gs://mdc-web-screenshot-tests
    // TODO(acdvorak): Figure out how to overwrite existing files
    // https://cloud.google.com/storage/docs/using-object-versioning
    // https://cloud.google.com/storage/docs/object-versioning
    const [exists] = await file.exists();
    if (exists) {
      console.log('✔︎ No changes to', gcsFilePath);
      return;
    }

    const stream = new Readable();
    stream.push(fileContents);
    stream.push(null);

    const metadata = {
      contentType: mimeTypes.lookup(relativeFilePath),
      metadata: customMetadata,
    };

    promises.push(
      new Promise((resolve, reject) => {
        // TODO(acdvorak): Use File#save() instead?
        // https://cloud.google.com/nodejs/docs/reference/storage/1.6.x/File#save
        stream.pipe(file.createWriteStream())
          .on('error', (err) => {
            reject(err);
          })
          .on('finish', async () => {
            try {
              // TODO(acdvorak): Set default bucket ACL to allow public access, and remove `makePublic()` API call
              await file.makePublic();
              await file.setMetadata(metadata);
              console.log(`✔︎ Uploaded ${GCLOUD_STORAGE_BASE_URL}${gcsFilePath}`);
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
