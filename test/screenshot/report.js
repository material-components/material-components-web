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
      this.fetchRunReportData_().then((runReport) => {
        /**
         * @type {!RunReport}
         * @private
         */
        this.runReport_ = runReport;
        this.updateAllAndGetState_();
      });
    }

    bindEventListeners_() {
      this.bindCopyCliCommandEventListener_();
      this.bindCloseCliCommandEventListener_();
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

    closeCliCommandModal_() {
      this.queryOne_('#report-cli-modal').dataset.state = 'closed';
      this.selectNone();
    }

    fetchRunReportData_() {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('load', () => resolve(JSON.parse(xhr.responseText)));
        xhr.addEventListener('error', (evt) => reject(evt));
        xhr.addEventListener('abort', (evt) => reject(evt));
        xhr.open('GET', './report.json');
        xhr.send();
      });
    }

    collapseAll() {
      const detailsElems = Array.from(document.querySelectorAll('details'));
      detailsElems.forEach((detailsElem) => detailsElem.open = false);
    }

    collapseNone() {
      const detailsElems = Array.from(document.querySelectorAll('details'));
      detailsElems.forEach((detailsElem) => detailsElem.open = true);
    }

    collapseImages() {
      this.collapseNone();
      const detailsElems = Array.from(document.querySelectorAll('.report-browser'));
      detailsElems.forEach((detailsElem) => detailsElem.open = false);
    }

    /**
     * @param {!HTMLInputElement} cbEl
     */
    changelistCheckboxChanged(cbEl) {
      const {changeGroupId} = cbEl.dataset;
      const childCbEls = this.queryAll_(`[data-change-group-id="${changeGroupId}"]`);
      childCbEls.forEach((childCbEl) => {
        childCbEl.checked = cbEl.checked;
        childCbEl.indeterminate = false;
      });

      this.updateAllAndGetState_();
    }

    /**
     * @param {!HTMLInputElement} cbEl
     */
    fileCheckboxChanged(cbEl) {
      const {changeGroupId, htmlFilePath} = cbEl.dataset;
      const childCbEls = this.queryAll_([
        `[data-change-group-id="${changeGroupId}"]`,
        `[data-html-file-path="${htmlFilePath}"]`,
      ].join(''));
      childCbEls.forEach((childCbEl) => {
        childCbEl.checked = cbEl.checked;
        childCbEl.indeterminate = false;
      });

      this.updateAllAndGetState_();
    }

    browserCheckboxChanged() {
      this.updateAllAndGetState_();
    }

    selectAll() {
      this.queryAll_('.report-browser__checkbox').forEach((cbEl) => {
        cbEl.checked = true;
        cbEl.indeterminate = false;
      });
      this.updateAllAndGetState_();
    }

    selectNone() {
      this.queryAll_('.report-browser__checkbox').forEach((cbEl) => {
        cbEl.checked = false;
        cbEl.indeterminate = false;
      });
      this.updateAllAndGetState_();
    }

    selectInverse() {
      this.queryAll_('.report-browser__checkbox').forEach((cbEl) => {
        cbEl.checked = !cbEl.checked;
        cbEl.indeterminate = false;
      });
      this.updateAllAndGetState_();
    }

    approveSelected() {
      const cbEls = this.queryAll_('.report-browser__checkbox:checked');
      this.setReviewStatus_(cbEls, 'approve');
      const report = this.updateAllAndGetState_();
      this.showCliCommand_('screenshot:approve', this.getApproveCommandArgs_(report));
    }

    retrySelected() {
      const cbEls = this.queryAll_('.report-browser__checkbox:checked');
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
        cbEl.closest('.report-browser').dataset.reviewStatus = reviewStatus;
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
      const reportUrlArg = `--report=${this.runReport_.runResult.publicReportJsonUrl}`;

      if (reportUiState.uncheckedBrowserCbEls.length === 0) {
        return ['--all', reportUrlArg];
      }

      const args = [];

      for (const [changeGroupId, changelist] of Object.entries(reportUiState.changelistDict)) {
        if (changelist.checkedBrowserCbEls.length === 0) {
          continue;
        }

        if (changelist.uncheckedBrowserCbEls.length === 0) {
          args.push(`--all-${changeGroupId}`);
          continue;
        }

        const targets = [];

        for (const [htmlFilePath, page] of Object.entries(changelist.pageDict)) {
          for (const browserCbEl of page.checkedBrowserCbEls) {
            targets.push(`${htmlFilePath}:${browserCbEl.dataset.userAgentAlias}`);
          }
        }

        args.push(`--${changeGroupId}=${targets.join(',')}`);
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

      for (const browserCbEl of report.checkedBrowserCbEls) {
        htmlFilePathSet.add(browserCbEl.dataset.htmlFilePath);
        userAgentAliasSet.add(browserCbEl.dataset.userAgentAlias);
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
        checkedBrowserCbEls: [],
        uncheckedBrowserCbEls: [],
        changelistDict: {},
        reviewStatusCountDict: {},
      };

      const browserCbEls = this.queryAll_('.report-browser__checkbox');

      browserCbEls.forEach((browserCbEl) => {
        if (browserCbEl.disabled) {
          return;
        }

        const {changeGroupId, htmlFilePath} = browserCbEl.dataset;
        const changelistDataAttr = `[data-change-group-id="${changeGroupId}"]`;
        const pageDataAttr = `[data-change-group-id="${changeGroupId}"][data-html-file-path="${htmlFilePath}"]`;
        const changelistDict = reportUiState.changelistDict;

        changelistDict[changeGroupId] = changelistDict[changeGroupId] || {
          cbEl: this.queryOne_(`.report-changelist__checkbox${changelistDataAttr}`),
          countEl: this.queryOne_(`.report-changelist__checked-count${changelistDataAttr}`),
          reviewStatusEl: this.queryOne_(`.report-review-status--changelist${changelistDataAttr}`),
          checkedBrowserCbEls: [],
          uncheckedBrowserCbEls: [],
          reviewStatusCountDict: {},
          pageDict: {},
        };

        changelistDict[changeGroupId].pageDict[htmlFilePath] = changelistDict[changeGroupId].pageDict[htmlFilePath] || {
          cbEl: this.queryOne_(`.report-file__checkbox${pageDataAttr}`),
          countEl: this.queryOne_(`.report-file__checked-count${pageDataAttr}`),
          reviewStatusEl: this.queryOne_(`.report-review-status--file${pageDataAttr}`),
          checkedBrowserCbEls: [],
          uncheckedBrowserCbEls: [],
          reviewStatusCountDict: {},
        };

        if (browserCbEl.checked) {
          reportUiState.checkedBrowserCbEls.push(browserCbEl);
          changelistDict[changeGroupId].checkedBrowserCbEls.push(browserCbEl);
          changelistDict[changeGroupId].pageDict[htmlFilePath].checkedBrowserCbEls.push(browserCbEl);
        } else {
          reportUiState.uncheckedBrowserCbEls.push(browserCbEl);
          changelistDict[changeGroupId].uncheckedBrowserCbEls.push(browserCbEl);
          changelistDict[changeGroupId].pageDict[htmlFilePath].uncheckedBrowserCbEls.push(browserCbEl);
        }

        const reviewStatus = browserCbEl.dataset.reviewStatus;
        reportUiState.reviewStatusCountDict[reviewStatus] =
          (reportUiState.reviewStatusCountDict[reviewStatus] || 0) + 1;
        changelistDict[changeGroupId].reviewStatusCountDict[reviewStatus] =
          (changelistDict[changeGroupId].reviewStatusCountDict[reviewStatus] || 0) + 1;
        changelistDict[changeGroupId].pageDict[htmlFilePath].reviewStatusCountDict[reviewStatus] =
          (changelistDict[changeGroupId].pageDict[htmlFilePath].reviewStatusCountDict[reviewStatus] || 0) + 1;
      });

      for (const changelist of Object.values(reportUiState.changelistDict)) {
        const hasCheckedBrowsers = changelist.checkedBrowserCbEls.length > 0;
        const hasUncheckedBrowsers = changelist.uncheckedBrowserCbEls.length > 0;

        changelist.cbEl.checked = hasCheckedBrowsers;
        changelist.cbEl.indeterminate = hasCheckedBrowsers && hasUncheckedBrowsers;

        const clStatuses = Object.keys(changelist.reviewStatusCountDict);
        changelist.reviewStatusEl.dataset.reviewStatus = clStatuses.length === 1 ? clStatuses[0] : 'mixed';
        changelist.reviewStatusEl.innerText =
          this.getStatusBadgeText_(clStatuses.length === 1 ? clStatuses[0] : 'mixed');

        if (changelist.countEl) {
          changelist.countEl.innerText = String(changelist.checkedBrowserCbEls.length);
        }

        for (const page of Object.values(changelist.pageDict)) {
          const hasCheckedBrowsers = page.checkedBrowserCbEls.length > 0;
          const hasUncheckedBrowsers = page.uncheckedBrowserCbEls.length > 0;

          page.cbEl.checked = hasCheckedBrowsers;
          page.cbEl.indeterminate = hasCheckedBrowsers && hasUncheckedBrowsers;

          const pageStatuses = Object.keys(page.reviewStatusCountDict);
          page.reviewStatusEl.dataset.reviewStatus = pageStatuses.length === 1 ? pageStatuses[0] : 'mixed';
          page.reviewStatusEl.innerText =
            this.getStatusBadgeText_(pageStatuses.length === 1 ? pageStatuses[0] : 'mixed');

          if (page.countEl) {
            page.countEl.innerText = String(page.checkedBrowserCbEls.length);
          }
        }
      }

      return reportUiState;
    }

    /**
     * @param {!ReportUiState} reportUiState
     * @private
     */
    updateToolbar_(reportUiState) {
      const numChecked = reportUiState.checkedBrowserCbEls.length;
      const numUnchecked = reportUiState.uncheckedBrowserCbEls.length;

      const hasCheckedScreenshots = numChecked > 0;
      const hasUncheckedScreenshots = numUnchecked > 0;

      if (!hasUncheckedScreenshots && !hasCheckedScreenshots) {
        this.queryOne_('.report-toolbar').classList.add('report-toolbar--hidden');
        return;
      }

      const selectAllButton = this.queryOne_('#report-toolbar__select-all-button');
      const selectNoneButton = this.queryOne_('#report-toolbar__select-none-button');
      const selectInverseButton = this.queryOne_('#report-toolbar__select-inverse-button');
      const approveSelectedButton = this.queryOne_('#report-toolbar__approve-selected-button');
      const retrySelectedButton = this.queryOne_('#report-toolbar__retry-selected-button');
      const selectedCountEl = this.queryOne_('#report-toolbar__selected-count');

      selectAllButton.disabled = !hasUncheckedScreenshots;
      selectNoneButton.disabled = !hasCheckedScreenshots;
      selectInverseButton.disabled = !(hasCheckedScreenshots || hasUncheckedScreenshots);

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
