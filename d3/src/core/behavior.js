import d3 from 'd3';

export function draggable(el, dispatch) {
  let ret = d3.behavior.drag()
    .on('dragstart', dispatch.dragstart)
    .on('drag', dispatch.drag)
    .on('dragend', dispatch.dragend);
  d3.select(el).classed('draggable', true).call(ret);
  return ret;
}

export function zoomable(el, dispatch) {
  let ret = d3.behavior.zoom()
    .on('zoomstart', dispatch.zoomstart)
    .on('zoom', dispatch.zoom)
    .on('zoomend', dispatch.zoomend);
  d3.select(el).classed('zoomable', true).call(ret);
  return ret;
}

export class Zoomer {
  constructor(chart, orient = {}) {
    let {
      x = true,
      y = false
    } = orient;
    this.$el = d3.select('__empty__');
    this.chart = chart;
    this.orient = {
      x: x,
      y: y
    };
  }
  bind(el, dispatch) {
    let zoomer = this;
    function zoomstart() {
      d3.select(this).classed('zooming', true);
    }
    function zoom() {
      let scale = d3.event.scale,
        [tx, ty] = d3.event.translate;
      tx = Math.min(0, Math.max(tx, zoomer.chart.width * (1 - scale))),
      ty = Math.min(0, Math.max(ty, zoomer.chart.height * (1 - scale)));
      zoomer.zoom.scale(scale).translate([tx, ty]);
      if (zoomer.orient.x) {
        zoomer.chart.axes.x.$el.call(zoomer.chart.axes.x);
      }
      if (zoomer.orient.y) {
        zoomer.chart.axes.y.$el.call(zoomer.chart.axes.y);
      }
      if (zoomer.chart.ruler) {
        zoomer.chart.ruler.stick();
      }
      zoomer.chart.generator.redraw();
    }
    function zoomend() {
      d3.select(this).classed('zooming', false);
    }
    dispatch.on(`zoomstart.${this.chart.id}`, zoomstart)
      .on(`zoom.${this.chart.id}`, zoom)
      .on(`zoomend.${this.chart.id}`, zoomend);
    this.$el = d3.select(el);
    if (this.orient.x) {
      this.$el.classed('x', true);
    }
    if (this.orient.y) {
      this.$el.classed('y', true);
    }
    this.zoom = zoomable(el, dispatch).scaleExtent([1, Infinity]);
    this.bindAxes();
  }
  // Update axes's scale while zooming
  // If the scale's domain or range is modified programmatically, this function should be called again
  bindAxes() {
    if (this.orient.x) {
      this.zoom.x(this.chart.axes.x.scale());
    }
    if (this.orient.y) {
      this.zoom.y(this.chart.axes.y.scale());
    }
    return this;
  }
}