/*
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

window.mdc = window.mdc || {};

/** @type {!ReportUi} */
window.mdc.reportUi = (() => {
  class ReportUi {
    constructor() {
      this.bindEventListeners_();
      this.collapseAllExceptDeepLink_();

      this.fetchReportData_().then((reportData) => {
        /**
         * @type {!mdc.proto.ReportData}
         * @private
         */
        this.reportData_ = reportData;

        this.startTimeOffsetPolling_();
        this.updateAllAndGetState_();
      });
    }

    startTimeOffsetPolling_() {
      const updateTimeOffset = () => this.calculateTimeOffset_();
      updateTimeOffset();
      setInterval(updateTimeOffset, Duration.minutes(1).toMillis());
    }

    calculateTimeOffset_() {
      const startTimeEl = this.queryOne_('#report-metadata__start-time');
      const timeSinceStartEl = this.queryOne_('#report-metadata__time-since-start');
      const elapsedShort = Duration.elapsed(startTimeEl.dateTime).toHumanShort(0);
      const elapsedLong = Duration.elapsed(startTimeEl.dateTime).toHumanShort(2);
      timeSinceStartEl.innerText = `(about ${elapsedShort} ago)`;
      timeSinceStartEl.title = `${elapsedLong} ago`;
    }

    bindEventListeners_() {
      this.bindCopyCliCommandEventListener_();
      this.bindCloseCliCommandEventListener_();
      this.bindCheckboxChangeEventListener_();
    }

    bindCopyCliCommandEventListener_() {
      const copyButtonEl = this.queryOne_('#report-cli-modal__button--copy');

      const clipboard = new ClipboardJS('#report-cli-modal__button--copy', {
        target: () => this.queryOne_('#report-cli-modal__command'),
      });

      clipboard.on('success', () => {
        copyButtonEl.innerText = 'Copied!';
        setTimeout(() => {
          copyButtonEl.innerText = 'Copy';
        }, 2000);
      });

      clipboard.on('error', (err) => {
        console.error(err);
        copyButtonEl.innerText = 'Error!';
      });
    }

    bindCloseCliCommandEventListener_() {
      this.queryOne_('#report-cli-modal__button--close').addEventListener('click', () => {
        this.closeCliCommandModal_();
      });

      document.addEventListener('keydown', (evt) => {
        if (evt.code === 'Escape' || evt.key === 'Escape' || evt.keyCode === 27) {
          this.closeCliCommandModal_();
        }
      });
    }

    bindCheckboxChangeEventListener_() {
      document.addEventListener('change', (evt) => {
        const targetEl = evt.target;
        if (targetEl.matches('.report-collection__checkbox')) {
          this.collectionCheckboxChanged(targetEl);
        } else if (targetEl.matches('.report-html-file__checkbox')) {
          this.htmlFileCheckboxChanged(targetEl);
        } else if (targetEl.matches('.report-user-agent__checkbox')) {
          this.userAgentCheckboxChanged(targetEl);
        }
      });
    }

    closeCliCommandModal_() {
      this.queryOne_('#report-cli-modal').dataset.state = 'closed';
      this.selectNone();
    }

    fetchReportData_() {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('load', () => resolve(JSON.parse(xhr.responseText)));
        xhr.addEventListener('error', (evt) => reject(evt));
        xhr.addEventListener('abort', (evt) => reject(evt));
        xhr.open('GET', './report.json');
        xhr.send();
      });
    }

    collapseAllExceptDeepLink_() {
      const [, id] = (/^#(.+)$/.exec(location.hash || '') || []);
      if (!id) {
        return;
      }
      const deepLinkElem = document.getElementById(id);
      if (!deepLinkElem) {
        return;
      }
      const htmlFileDetailsElems = Array.from(document.querySelectorAll('details.report-html-file'));
      for (const htmlFileDetailsElem of htmlFileDetailsElems) {
        htmlFileDetailsElem.open = htmlFileDetailsElem.contains(deepLinkElem);
        if (htmlFileDetailsElem.open) {
          htmlFileDetailsElem.querySelectorAll('details.report-user-agent').forEach((userAgentDetailsElem) => {
            userAgentDetailsElem.open = userAgentDetailsElem.contains(deepLinkElem);
          });
          htmlFileDetailsElem.parentElement.closest('details').open = true;
          break;
        }
      }
    }

    collapseAll() {
      const allDetailsElems = Array.from(document.querySelectorAll('details'));
      allDetailsElems.forEach((detailsElem) => detailsElem.open = false);
    }

    collapseNone() {
      const allDetailsElems = Array.from(document.querySelectorAll('details'));
      allDetailsElems.forEach((detailsElem) => detailsElem.open = true);
    }

    collapseImages() {
      const userAgentDetailsElems = Array.from(document.querySelectorAll('.report-user-agent'));
      userAgentDetailsElems.forEach((detailsElem) => detailsElem.open = false);
    }

    /**
     * @param {!HTMLInputElement} cbEl
     */
    collectionCheckboxChanged(cbEl) {
      // TODO(acdvorak): Replace dataset with getAttribute/setAttribute (it makes search/replace easier)
      const {collectionType} = cbEl.dataset;
      const childCbEls = this.queryAll_(`[data-collection-type="${collectionType}"]`);
      childCbEls.forEach((childCbEl) => {
        childCbEl.checked = cbEl.checked;
        childCbEl.indeterminate = false;
      });

      this.updateAllAndGetState_();
    }

    /**
     * @param {!HTMLInputElement} cbEl
     */
    htmlFileCheckboxChanged(cbEl) {
      const {collectionType, htmlFilePath} = cbEl.dataset;
      const childCbEls = this.queryAll_([
        `[data-collection-type="${collectionType}"]`,
        `[data-html-file-path="${htmlFilePath}"]`,
      ].join(''));
      childCbEls.forEach((childCbEl) => {
        childCbEl.checked = cbEl.checked;
        childCbEl.indeterminate = false;
      });

      this.updateAllAndGetState_();
    }

    userAgentCheckboxChanged() {
      this.updateAllAndGetState_();
    }

    selectAll() {
      this.queryAll_('.report-user-agent__checkbox:not(.report-user-agent__checkbox--hidden)').forEach((cbEl) => {
        cbEl.checked = true;
        cbEl.indeterminate = false;
      });
      this.updateAllAndGetState_();
    }

    selectNone() {
      this.queryAll_('.report-user-agent__checkbox:not(.report-user-agent__checkbox--hidden)').forEach((cbEl) => {
        cbEl.checked = false;
        cbEl.indeterminate = false;
      });
      this.updateAllAndGetState_();
    }

    selectUnreviewed() {
      this.queryAll_('.report-user-agent__checkbox:not(.report-user-agent__checkbox--hidden)').forEach((cbEl) => {
        cbEl.checked = cbEl.matches('[data-review-status="unreviewed"]');
        cbEl.indeterminate = false;
      });
      this.updateAllAndGetState_();
    }

    selectInverse() {
      this.queryAll_('.report-user-agent__checkbox:not(.report-user-agent__checkbox--hidden)').forEach((cbEl) => {
        cbEl.checked = !cbEl.checked;
        cbEl.indeterminate = false;
      });
      this.updateAllAndGetState_();
    }

    approveSelected() {
      const cbEls = this.queryAll_('.report-user-agent__checkbox:not(.report-user-agent__checkbox--hidden):checked');
      this.setReviewStatus_(cbEls, 'approve');
      const report = this.updateAllAndGetState_();
      this.showCliCommand_('screenshot:approve', this.getApproveCommandArgs_(report));
    }

    retrySelected() {
      const cbEls = this.queryAll_('.report-user-agent__checkbox:not(.report-user-agent__checkbox--hidden):checked');
      this.setReviewStatus_(cbEls, 'retry');
      const reportUiState = this.updateAllAndGetState_();
      this.showCliCommand_('screenshot:test', this.getRetryCommandArgs_(reportUiState));
    }

    /**
     * @param {!Array<!HTMLInputElement>} cbEls
     * @param {string} reviewStatus
     * @private
     */
    setReviewStatus_(cbEls, reviewStatus) {
      cbEls.forEach((cbEl) => {
        cbEl.dataset.reviewStatus = reviewStatus;
        cbEl.closest('.report-user-agent').dataset.reviewStatus = reviewStatus;
        cbEl.parentElement.querySelector('.report-review-status').dataset.reviewStatus = reviewStatus;
        cbEl.parentElement.querySelector('.report-review-status').innerText = this.getStatusBadgeText_(reviewStatus);
      });
    }

    /**
     * @param {string} npmCommand
     * @param {!Array<string>} commandArgs
     * @private
     */
    showCliCommand_(npmCommand, commandArgs) {
      const cliCommandStr = `npm run ${npmCommand} -- ${commandArgs.join(' ')}`;
      const cliCommandModalEl = this.queryOne_('#report-cli-modal');
      const cliCommandInputEl = this.queryOne_('#report-cli-modal__command');
      cliCommandModalEl.dataset.state = 'open';
      cliCommandInputEl.value = cliCommandStr;
      cliCommandInputEl.select();
      setTimeout(() => cliCommandInputEl.focus());
    }

    /**
     * @param {!ReportUiState} reportUiState
     * @return {!Array<string>}
     * @private
     */
    getApproveCommandArgs_(reportUiState) {
      const reportUrlArg = `--report=${this.reportData_.meta.report_json_file.public_url}`;

      if (reportUiState.uncheckedUserAgentCbEls.length === 0) {
        return ['--all', reportUrlArg];
      }

      const args = [];

      for (const [collectionType, collection] of Object.entries(reportUiState.collectionDict)) {
        if (collection.checkedUserAgentCbEls.length === 0) {
          continue;
        }

        if (collection.uncheckedUserAgentCbEls.length === 0) {
          args.push(`--all-${collectionType}`);
          continue;
        }

        const targets = [];

        for (const [htmlFilePath, page] of Object.entries(collection.pageDict)) {
          for (const userAgentCbEl of page.checkedUserAgentCbEls) {
            targets.push(`${htmlFilePath}:${userAgentCbEl.dataset.userAgentAlias}`);
          }
        }

        args.push(`--${collectionType}=${targets.join(',')}`);
      }

      args.push(reportUrlArg);

      return args;
    }

    /**
     * @param {!Object} report
     * @return {!Array<string>}
     * @private
     */
    getRetryCommandArgs_(report) {
      const htmlFilePathSet = new Set();
      const userAgentAliasSet = new Set();

      for (const userAgentCbEl of report.checkedUserAgentCbEls) {
        htmlFilePathSet.add(userAgentCbEl.dataset.htmlFilePath);
        userAgentAliasSet.add(userAgentCbEl.dataset.userAgentAlias);
      }

      return [
        ...Array.from(htmlFilePathSet.values()).map((htmlFilePath) => `--url=${htmlFilePath}`),
        ...Array.from(userAgentAliasSet.values()).map((userAgentAlias) => `--browser=${userAgentAlias}`),
      ];
    }

    /**
     * @return {!ReportUiState}
     * @private
     */
    updateAllAndGetState_() {
      const reportUiState = this.updateCountsAndGetState_();
      this.updateToolbar_(reportUiState);
      return reportUiState;
    }

    updateCountsAndGetState_() {
      /** @type {!ReportUiState} */
      const reportUiState = {
        checkedUserAgentCbEls: [],
        uncheckedUserAgentCbEls: [],
        unreviewedUserAgentCbEls: [],
        collectionDict: {},
        reviewStatusCountDict: {},
      };

      const userAgentCbEls = this.queryAll_('.report-user-agent__checkbox:not(.report-user-agent__checkbox--hidden)');

      userAgentCbEls.forEach((userAgentCbEl) => {
        if (userAgentCbEl.disabled) {
          return;
        }

        const {collectionType, htmlFilePath} = userAgentCbEl.dataset;
        const collectionDataAttr = `[data-collection-type="${collectionType}"]`;
        const htmlFileDataAttr = `[data-collection-type="${collectionType}"][data-html-file-path="${htmlFilePath}"]`;
        const {collectionDict} = reportUiState;

        collectionDict[collectionType] =
          collectionDict[collectionType] || {
            cbEl: this.queryOne_(`.report-collection__checkbox${collectionDataAttr}`),
            reviewStatusEl: this.queryOne_(`.report-review-status--collection${collectionDataAttr}`),
            checkedUserAgentCbEls: [],
            uncheckedUserAgentCbEls: [],
            reviewStatusCountDict: {},
            pageDict: {},
          };

        collectionDict[collectionType].pageDict[htmlFilePath] =
          collectionDict[collectionType].pageDict[htmlFilePath] || {
            cbEl: this.queryOne_(`.report-html-file__checkbox${htmlFileDataAttr}`),
            reviewStatusEl: this.queryOne_(`.report-review-status--html-file${htmlFileDataAttr}`),
            checkedUserAgentCbEls: [],
            uncheckedUserAgentCbEls: [],
            reviewStatusCountDict: {},
          };

        if (userAgentCbEl.checked) {
          reportUiState.checkedUserAgentCbEls.push(userAgentCbEl);
          collectionDict[collectionType].checkedUserAgentCbEls.push(userAgentCbEl);
          collectionDict[collectionType].pageDict[htmlFilePath].checkedUserAgentCbEls.push(userAgentCbEl);
        } else {
          reportUiState.uncheckedUserAgentCbEls.push(userAgentCbEl);
          collectionDict[collectionType].uncheckedUserAgentCbEls.push(userAgentCbEl);
          collectionDict[collectionType].pageDict[htmlFilePath].uncheckedUserAgentCbEls.push(userAgentCbEl);
        }

        const reviewStatus = userAgentCbEl.dataset.reviewStatus;
        reportUiState.reviewStatusCountDict[reviewStatus] =
          (reportUiState.reviewStatusCountDict[reviewStatus] || 0) + 1;
        collectionDict[collectionType].reviewStatusCountDict[reviewStatus] =
          (collectionDict[collectionType].reviewStatusCountDict[reviewStatus] || 0) + 1;
        collectionDict[collectionType].pageDict[htmlFilePath].reviewStatusCountDict[reviewStatus] =
          (collectionDict[collectionType].pageDict[htmlFilePath].reviewStatusCountDict[reviewStatus] || 0) + 1;

        if (reviewStatus === 'unreviewed') {
          reportUiState.unreviewedUserAgentCbEls.push(userAgentCbEl);
        }
      });

      for (const collection of Object.values(reportUiState.collectionDict)) {
        const hasCheckedBrowsers = collection.checkedUserAgentCbEls.length > 0;
        const hasUncheckedBrowsers = collection.uncheckedUserAgentCbEls.length > 0;

        collection.cbEl.checked = hasCheckedBrowsers;
        collection.cbEl.indeterminate = hasCheckedBrowsers && hasUncheckedBrowsers;

        const clStatuses = Object.keys(collection.reviewStatusCountDict);
        collection.reviewStatusEl.dataset.reviewStatus = clStatuses.length === 1 ? clStatuses[0] : 'mixed';
        collection.reviewStatusEl.innerText =
          this.getStatusBadgeText_(clStatuses.length === 1 ? clStatuses[0] : 'mixed');

        for (const page of Object.values(collection.pageDict)) {
          const hasCheckedBrowsers = page.checkedUserAgentCbEls.length > 0;
          const hasUncheckedBrowsers = page.uncheckedUserAgentCbEls.length > 0;

          page.cbEl.checked = hasCheckedBrowsers;
          page.cbEl.indeterminate = hasCheckedBrowsers && hasUncheckedBrowsers;

          const pageStatuses = Object.keys(page.reviewStatusCountDict);
          page.reviewStatusEl.dataset.reviewStatus = pageStatuses.length === 1 ? pageStatuses[0] : 'mixed';
          page.reviewStatusEl.innerText =
            this.getStatusBadgeText_(pageStatuses.length === 1 ? pageStatuses[0] : 'mixed');
        }
      }

      return reportUiState;
    }

    /**
     * @param {!ReportUiState} reportUiState
     * @private
     */
    updateToolbar_(reportUiState) {
      const numChecked = reportUiState.checkedUserAgentCbEls.length;
      const numUnchecked = reportUiState.uncheckedUserAgentCbEls.length;
      const numUnreviewed = reportUiState.unreviewedUserAgentCbEls.length;

      const hasCheckedScreenshots = numChecked > 0;
      const hasUncheckedScreenshots = numUnchecked > 0;
      const hasUnreviewedScreenshots = numUnreviewed > 0;

      if (!hasUncheckedScreenshots && !hasCheckedScreenshots) {
        return;
      }

      this.queryOne_('#report-toolbar__approval-column').classList.remove('report-toolbar__column--hidden');
      this.queryOne_('#report-toolbar__selection-column').classList.remove('report-toolbar__column--hidden');

      const selectAllButton = this.queryOne_('#report-toolbar__select-all-button');
      const selectNoneButton = this.queryOne_('#report-toolbar__select-none-button');
      const selectInverseButton = this.queryOne_('#report-toolbar__select-inverse-button');
      const selectUnreviewedButton = this.queryOne_('#report-toolbar__select-unreviewed-button');
      const approveSelectedButton = this.queryOne_('#report-toolbar__approve-selected-button');
      const retrySelectedButton = this.queryOne_('#report-toolbar__retry-selected-button');
      const selectedCountEl = this.queryOne_('#report-toolbar__selected-count');

      selectAllButton.disabled = !hasUncheckedScreenshots;
      selectNoneButton.disabled = !hasCheckedScreenshots;
      selectInverseButton.disabled = !(hasCheckedScreenshots || hasUncheckedScreenshots);
      selectUnreviewedButton.disabled = !(hasUnreviewedScreenshots && hasUncheckedScreenshots);

      approveSelectedButton.disabled = !hasCheckedScreenshots;
      retrySelectedButton.disabled = !hasCheckedScreenshots;

      selectedCountEl.innerText = `${numChecked}`;
    }

    getStatusBadgeText_(reviewStatus) {
      const names = {
        'approve': 'approve',
        'retry': 'retry',
        'mixed': 'mixed',
        'unreviewed': 'unreviewed',
      };
      return names[reviewStatus] || reviewStatus;
    }

    /**
     * @param {string} query
     * @return {!Array<!HTMLElement>}
     * @private
     */
    queryAll_(query) {
      return Array.from(document.querySelectorAll(query));
    }

    /**
     * @param {string} query
     * @return {?HTMLElement}
     * @private
     */
    queryOne_(query) {
      return document.querySelector(query);
    }
  }

  return new ReportUi();
})();
