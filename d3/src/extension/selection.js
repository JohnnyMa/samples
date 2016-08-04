import d3 from 'd3';
import { extend } from 'helpers/utils.js';

extend(d3.selection.prototype, {
  show() {
    return this.style('display', null);
  },
  hide() {
    return this.style('display', 'none');
  }
});