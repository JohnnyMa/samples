import d3 from 'd3';
import axis from 'core/axis.js';
import { extend, evalOpt, uuid } from 'helpers/utils.js';
import 'extension/selection.js';
import LineGenerator from 'core/line-generator.js';
import { Zoomer } from 'core/behavior.js';
import Ruler from 'core/ruler.js';
import chartStyle from 'chart.css.raw';

const DEFAULTS_CHART_HEIGHT = 300;
const DEFAULTS_CHART_MARGIN_TOP = 20;
const DEFAULTS_CHART_MARGIN_BOTTOM = 30;
const DEFAULTS_CHART_MARGIN_LEFT = 20;
const DEFAULTS_CHART_MARGIN_RIGHT = 20;

function color(series) {
  return d3.scale.category20().domain(d3.map(series, function(s) {
    return s.name;
  }));
}

export default class Chart {
  constructor(el, series = [], options = {}) {
    let {
      height = DEFAULTS_CHART_HEIGHT - DEFAULTS_CHART_MARGIN_TOP - DEFAULTS_CHART_MARGIN_BOTTOM,
      margin = {},
      axes,
      zoomer = {
        x: true,
        y: false
      },
      ruler,
      generator
    } = options, {
      top = DEFAULTS_CHART_MARGIN_TOP,
      right = DEFAULTS_CHART_MARGIN_RIGHT,
      bottom = DEFAULTS_CHART_MARGIN_BOTTOM,
      left = DEFAULTS_CHART_MARGIN_LEFT
    } = margin;
    margin = {
      top: top,
      right: right,
      bottom: bottom,
      left: left
    };
    this.id = uuid();
    this.events = Chart.dispatch();
    this.$container = d3.select(el);
    this.$el = d3.select('__empty__');
    this.width = this.$container.node().clientWidth - margin.left - margin.right;
    this.height = height;
    this.margin = margin;
    this.series = series;
    this.color = color(series);
    this.axes = {
      x: axis(extend(axes.x, {
        className: 'x'
      }), this),
      y: axis(extend(axes.y, {
        className: 'y'
      }), this)
    };
    this.threshold = {
      x: this.axes.x.threshold(series),
      y: this.axes.y.threshold(series)
    };
    if (zoomer) {
      this.zoomer = new Zoomer(this, zoomer);
    }
    if (ruler) {
      this.ruler = new Ruler(this, ruler);
    }
    this.generator = evalOpt(generator, function(chart) {
      return new LineGenerator(chart);
    }, this);
  }
  draw(overlay, dispatch) {
    let chart = this, interactivePanel;
    // svg
    if (dispatch) {
      this.events = dispatch;
    }
    this.$svg = this.$container.append('svg')
      .attr({
        viewBox: [
          0,
          0,
          this.width + this.margin.left + this.margin.right,
          this.height + this.margin.top + this.margin.bottom
        ].join(' '),
        width: this.width + this.margin.left + this.margin.right,
        height: this.height + this.margin.top + this.margin.bottom
      });
    // defs, style, clip-path
    this.$svg.append('defs')
      .append('style')
      .attr('type', 'text/css')
      .html(chartStyle);
    this.$svg.select('defs').append('clipPath')
      .attr('id', `clip-path:${this.id}`)
     .append('rect')
      .classed('clip-path', true)
      .attr({
        x: 0,
        y: 0,
        width: this.width,
        height: this.height
      });
    this.$el = this.$svg.append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
    // x axis
    this.axes.x.draw();
    // y axis
    this.axes.y.draw();
    // graphics
    this.generator.draw();
    // interactive panel
    if (!overlay) {
      interactivePanel = this.$el.append('rect')
      .classed('interactive-panel', true)
      .style({
        fill: 'none',
        'pointer-events': 'all'
      })
      .attr({
        width: this.width,
        height: this.height
      }).node();
    } else {
      interactivePanel = overlay;
    }
    // zoomer
    if (this.zoomer) {
      this.zoomer.bind(
        interactivePanel, this.events
      );
    }
    // ruler
    if (this.ruler) {
      this.ruler.draw().bind(
        interactivePanel, this.events
      ).center();
    }
    d3.select(window).on('resize', this.events.resize);
    this.events.on(`resize.${this.id}`, function() {
      chart.resize();
    });
    return this;
  }
  datachange() {
    this.color = color(this.series);
    this.axes.x.datachange();
    this.axes.y.datachange();
    this.generator.datachange();
    if (this.zoomer) {
      this.zoomer.bindAxes();
    }
    if (this.ruler) {
      this.ruler.stick();
    }
    return this;
  }
  resize() {
    let containerWidth = this.$container.node().clientWidth;
    this.width = containerWidth - this.margin.left - this.margin.right;
    this.$svg.attr({
      viewBox: [
        0,
        0,
        containerWidth,
        this.height + this.margin.top + this.margin.bottom
      ].join(' '),
      width: this.width + this.margin.left + this.margin.right
    });
    this.$svg.select('.clip-path').attr('width', this.width);
    this.$svg.select('.interactive-panel').attr('width', this.width);
    this.axes.x.resize();
    this.generator.redraw();
    if (this.ruler) {
      this.ruler.center();
    }
    if (this.zoomer) {
      this.zoomer.bindAxes();
    }
  }
  delegate(el, event, callback) {
    let chart = this;
    d3.select(el).on(event, function(d, i) {
      callback.call(this, chart, d, i);
    });
    return this;
  }
  download() {
    let image, context, canvas;
    if (!this.$svg) {
      return;
    }
    canvas = document.createElement('canvas');
    d3.select(canvas).attr({
      width: this.width + this.margin.left + this.margin.right,
      height: this.height + this.margin.top + this.margin.bottom
    });
    context = canvas.getContext('2d');
    image = new window.Image();
    image.onload = function() {
      let a = d3.select('body').append('a').node();
      context.drawImage(image, 0, 0);
      a.download = 'download.png';
      a.href = canvas.toDataURL("image/png");
      a.click();
      d3.select(a).remove();
    };
    image.src = 'data:image/svg+xml;base64,' + window.btoa(
      unescape(encodeURIComponent(
        new window.XMLSerializer().serializeToString(this.$svg.node())
      ))
    );
  }
}

function globalEvents() {
  return d3.dispatch(
    'drag',
    'dragstart',
    'dragend',
    'zoom',
    'zoomstart',
    'zoomend',
    'resize'
  );
}

Chart.dispatch = globalEvents;