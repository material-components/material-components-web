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
window.mdc.report = window.mdc.report || (() => {
  class Report {
    constructor() {
      this.updateAll_();
    }

    collapseAll() {
      const detailsElems = Array.from(document.querySelectorAll('details'));
      detailsElems.forEach((detailsElem) => detailsElem.open = false);
    }

    collapseNone() {
      const detailsElems = Array.from(document.querySelectorAll('details'));
      detailsElems.forEach((detailsElem) => detailsElem.open = true);
    }

    collapseBrowsers() {
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
      this.queryAll_('.report-browser__checkbox:checked').forEach((cbEl) => {
        cbEl.dataset.reviewStatus = 'approve';
        cbEl.closest('.report-browser').dataset.reviewStatus = 'approve';
        cbEl.parentElement.querySelector('.report-review-status').dataset.reviewStatus = 'approve';
        cbEl.parentElement.querySelector('.report-review-status').innerText = this.getStatusBadgeText_('approve');
        cbEl.checked = false;
      });
      this.updateAll_();
      setTimeout(() => {
        window.alert('CLI command copied to clipboard!');
      });
    }

    retrySelected() {
      this.queryAll_('.report-browser__checkbox:checked').forEach((cbEl) => {
        cbEl.dataset.reviewStatus = 'retry';
        cbEl.closest('.report-browser').dataset.reviewStatus = 'retry';
        cbEl.parentElement.querySelector('.report-review-status').dataset.reviewStatus = 'retry';
        cbEl.parentElement.querySelector('.report-review-status').innerText = this.getStatusBadgeText_('retry');
        cbEl.checked = false;
      });
      this.updateAll_();
      setTimeout(() => {
        window.alert('CLI command copied to clipboard!');
      });
    }

    copyCliCommand() {

    }

    updateAll_() {
      const report = this.updateCounts_();
      this.updateToolbar_(report);
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

        // TODO(acdvorak)
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

          // TODO(acdvorak)
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
        'approve': 'approved',
        'retry': 'retried',
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

  return new Report();
})();
