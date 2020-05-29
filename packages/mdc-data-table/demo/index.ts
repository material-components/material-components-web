import {MDCDataTable} from '../component';
import './index.scss';

const el = document.querySelector<HTMLElement>('.mdc-data-table');

if (el) {
  MDCDataTable.attachTo(el);
}
