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
        this.updateAll_();
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

      this.updateAll_();
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

      this.updateAll_();
    }

    /**
     * @param {!HTMLInputElement} cbEl
     */
    browserCheckboxChanged(cbEl) {
      this.updateAll_();
    }

    selectAll() {
      this.queryAll_('.report-browser__checkbox').forEach((cbEl) => {
        cbEl.checked = true;
        cbEl.indeterminate = false;
      });
      this.updateAll_();
    }

    selectNone() {
      this.queryAll_('.report-browser__checkbox').forEach((cbEl) => {
        cbEl.checked = false;
        cbEl.indeterminate = false;
      });
      this.updateAll_();
    }

    selectInverse() {
      this.queryAll_('.report-browser__checkbox').forEach((cbEl) => {
        cbEl.checked = !cbEl.checked;
        cbEl.indeterminate = false;
      });
      this.updateAll_();
    }

    approveSelected() {
      const cbEls = this.queryAll_('.report-browser__checkbox:checked');
      this.setReviewStatus_(cbEls, 'approve');
      const report = this.updateAll_();
      this.showCliCommand_('screenshot:approve', this.getApproveCommandArgs_(report));
    }

    retrySelected() {
      const cbEls = this.queryAll_('.report-browser__checkbox:checked');
      this.setReviewStatus_(cbEls, 'retry');
      const report = this.updateAll_();
      this.showCliCommand_('screenshot:test', this.getRetryCommandArgs_(report));
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
     * @param {!Object} report
     * @return {!Array<string>}
     * @private
     */
    getApproveCommandArgs_(report) {
      const args = [];

      for (const [changeGroupId, changelist] of Object.entries(report.changelists)) {
        if (changelist.checkedBrowserCbEls.length === 0) {
          continue;
        }

        if (changelist.uncheckedBrowserCbEls.length === 0) {
          args.push(`--all-${changeGroupId}`);
          continue;
        }

        const targets = [];

        for (const [htmlFilePath, page] of Object.entries(changelist.pageMap)) {
          for (const browserCbEl of page.checkedBrowserCbEls) {
            targets.push(`${htmlFilePath}:${browserCbEl.dataset.userAgentAlias}`);
          }
        }

        args.push(`--${changeGroupId}=${targets.join(',')}`);
      }

      if (args.length === ['diffs', 'added', 'removed'].length && args.every((arg) => arg.startsWith('--all-'))) {
        args.length = 0;
        args.push('--all');
      }

      args.push(`--report=${this.runReport_.runResult.publicReportJsonUrl}`);

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
        ...Array.from(htmlFilePathSet.values()).map((htmlFilePath) => `--mdc-include=url=${htmlFilePath}`),
        ...Array.from(userAgentAliasSet.values()).map((userAgentAlias) => `--mdc-include=browser=${userAgentAlias}`),
      ];
    }

    updateAll_() {
      const report = this.updateCounts_();
      this.updateToolbar_(report);
      return report;
    }

    updateCounts_() {
      // const report = {
      //   checkedBrowserCbEls: [],
      //   uncheckedBrowserCbEls: [],
      //   changelists: {
      //     diffs: {
      //       cbEl: null,
      //       countEl: null,
      //       reviewStatusEl: null,
      //       checkedBrowserCbEls: [],
      //       uncheckedBrowserCbEls: [],
      //       pageMap: {
      //         'baseline.html': {
      //           cbEl: null,
      //           countEl: null,
      //           reviewStatusEl: null,
      //           checkedBrowserCbEls: [],
      //           uncheckedBrowserCbEls: [],
      //         },
      //       },
      //     },
      //   },
      // };
      const report = {
        checkedBrowserCbEls: [],
        uncheckedBrowserCbEls: [],
        changelists: {},
        reviewStatuses: {},
      };

      const browserCbEls = this.queryAll_('.report-browser__checkbox');

      browserCbEls.forEach((browserCbEl) => {
        if (browserCbEl.disabled) {
          return;
        }

        const {changeGroupId, htmlFilePath} = browserCbEl.dataset;
        const changelistDataAttr = `[data-change-group-id="${changeGroupId}"]`;
        const pageDataAttr = `[data-change-group-id="${changeGroupId}"][data-html-file-path="${htmlFilePath}"]`;
        const changelists = report.changelists;

        changelists[changeGroupId] = changelists[changeGroupId] || {
          cbEl: this.queryOne_(`.report-changelist__checkbox${changelistDataAttr}`),
          countEl: this.queryOne_(`.report-changelist__checked-count${changelistDataAttr}`),
          reviewStatusEl: this.queryOne_(`.report-review-status--changelist${changelistDataAttr}`),
          checkedBrowserCbEls: [],
          uncheckedBrowserCbEls: [],
          reviewStatuses: {},
          pageMap: {},
        };

        changelists[changeGroupId].pageMap[htmlFilePath] = changelists[changeGroupId].pageMap[htmlFilePath] || {
          cbEl: this.queryOne_(`.report-file__checkbox${pageDataAttr}`),
          countEl: this.queryOne_(`.report-file__checked-count${pageDataAttr}`),
          reviewStatusEl: this.queryOne_(`.report-review-status--file${pageDataAttr}`),
          checkedBrowserCbEls: [],
          uncheckedBrowserCbEls: [],
          reviewStatuses: {},
        };

        if (browserCbEl.checked) {
          report.checkedBrowserCbEls.push(browserCbEl);
          changelists[changeGroupId].checkedBrowserCbEls.push(browserCbEl);
          changelists[changeGroupId].pageMap[htmlFilePath].checkedBrowserCbEls.push(browserCbEl);
        } else {
          report.uncheckedBrowserCbEls.push(browserCbEl);
          changelists[changeGroupId].uncheckedBrowserCbEls.push(browserCbEl);
          changelists[changeGroupId].pageMap[htmlFilePath].uncheckedBrowserCbEls.push(browserCbEl);
        }

        const reviewStatus = browserCbEl.dataset.reviewStatus;
        report.reviewStatuses[reviewStatus] =
          (report.reviewStatuses[reviewStatus] || 0) + 1;
        changelists[changeGroupId].reviewStatuses[reviewStatus] =
          (changelists[changeGroupId].reviewStatuses[reviewStatus] || 0) + 1;
        changelists[changeGroupId].pageMap[htmlFilePath].reviewStatuses[reviewStatus] =
          (changelists[changeGroupId].pageMap[htmlFilePath].reviewStatuses[reviewStatus] || 0) + 1;
      });

      for (const [changeGroupId, changelist] of Object.entries(report.changelists)) {
        const hasCheckedBrowsers = changelist.checkedBrowserCbEls.length > 0;
        const hasUncheckedBrowsers = changelist.uncheckedBrowserCbEls.length > 0;

        changelist.cbEl.checked = hasCheckedBrowsers;
        changelist.cbEl.indeterminate = hasCheckedBrowsers && hasUncheckedBrowsers;

        const clStatuses = Object.keys(changelist.reviewStatuses);
        changelist.reviewStatusEl.dataset.reviewStatus = clStatuses.length === 1 ? clStatuses[0] : 'mixed';
        changelist.reviewStatusEl.innerText =
          this.getStatusBadgeText_(clStatuses.length === 1 ? clStatuses[0] : 'mixed');

        if (changelist.countEl) {
          changelist.countEl.innerText = String(changelist.checkedBrowserCbEls.length);
        }

        for (const [htmlFilePath, page] of Object.entries(changelist.pageMap)) {
          const hasCheckedBrowsers = page.checkedBrowserCbEls.length > 0;
          const hasUncheckedBrowsers = page.uncheckedBrowserCbEls.length > 0;

          page.cbEl.checked = hasCheckedBrowsers;
          page.cbEl.indeterminate = hasCheckedBrowsers && hasUncheckedBrowsers;

          const pageStatuses = Object.keys(page.reviewStatuses);
          page.reviewStatusEl.dataset.reviewStatus = pageStatuses.length === 1 ? pageStatuses[0] : 'mixed';
          page.reviewStatusEl.innerText =
            this.getStatusBadgeText_(pageStatuses.length === 1 ? pageStatuses[0] : 'mixed');

          if (page.countEl) {
            page.countEl.innerText = String(page.checkedBrowserCbEls.length);
          }
        }
      }

      return report;
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

    updateToolbar_(report) {
      const numChecked = report.checkedBrowserCbEls.length;
      const numUnchecked = report.uncheckedBrowserCbEls.length;

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
