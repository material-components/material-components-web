# TODO

- [ ] Display elapsed end-to-end run time
- [ ] Merge stdout/stderr in the UI (sorted by timestamp), color code stderr red
- [ ] What happens if somebody deletes their remote repo/branch? We should fall back to checking out GitHub's `pr/<NUM>` branch
- [ ] Add "Cancel" button
- [ ] Require a keepalive signal from browser to keep a request in the queue? E.g., if the browser dies or navigates away, should the request disappear? What about reconnect?
- [ ] Keep the ALL servers running all the time; only ask them to fetch new branches and rebuild
- [ ] Expose commit hash and build date/time/duration on both boss and demo servers (e.g., /info/index.html)
- [ ] Tag docker images with the current HEAD commit hash/branch, plus a tag indicating whether there are un-staged changes
- [ ] Extract common base image?
    - Install apt packages, nvm, gcloud, kubectl
    - Set up demobot user account
    - Configure git user.name/user.email
    - Copy auth files for GCloud/CBT and initialize GCloud login
    - Clone MDC-Web GitHub repo
    - Install node modules
- [ ] Create scripts for common things like publishing a GCloud image (if there's enough shared behavior)
- [ ] Log everything and expose logs on dashboard and/or JSON endpoint
- [ ] Error reporting
- [ ] Figure out where to put CBT code, and how to split up screenshot tests vs. test runner infra code
- [ ] Enqueue screenshot testing requests
- [ ] Diff screenshots
- [ ] DNS for demo and boss servers
- [ ] TLS for demo and boss servers

# DONE

- [x] Use `BASH_ENV` to force bash to run startup scripts
- [x] Rename $ENV to $MCW_ENV? (ENV is used by `bash --posix`, and could collide with other scripts;
      it's also horribly un-specific about which part of the stack uses it)
- [x] Move index.js from /scripts to /app (or w/e)
- [x] Create dev/prod versions of demo-server/cloudbuild.yaml
- [x] Allow run-screenshot-test.sh to run locally instead of always using GCloud
- [x] Progress bars!

