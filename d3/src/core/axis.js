import d3 from 'd3';
import { extend, addMethods, isNil } from 'helpers/utils.js';

const mixins = {
  draw() {
    let axis = this, chart = this.chart;
    this.$el = chart.$el.append('g')
      .classed(this.className.split(' ').concat(['axis']).join(' '), true)
      .attr('transform', function() {
        if (axis.orient() === 'top') {
          return 'translate(0, 0)';
        }
        if (axis.orient() === 'bottom') {
          return `translate(0, ${chart.height})`;
        }
        if (axis.orient() === 'right') {
          return `translate(${chart.width}, 0)`;
        }
        return null;
      })
      .style('display', axis.visible ? null : 'none').call(this);
    return this;
  },
  datachange() {
    this.scale(this.fn.scale.call(this, this.chart));
    if (this.fn.ticks) {
      this.ticks(this.fn.ticks.call(this, this.chart));
    }
    return this.redraw();
  },
  redraw() {
    this.$el.call(this);
    return this;
  },
  resize() {
    this.scale().range([0, this.chart.width]);
    if (this.fn.ticks) {
      this.ticks(this.fn.ticks.call(this, this.chart));
    }
    return this.redraw();
  },
  threshold() {
    let axis = this, series = this.chart.series;
    return [
      d3.min(series, function(s) { return d3.min(s.data, axis.accessor); }),
      d3.max(series, function(s) { return d3.max(s.data, axis.accessor); })
    ];
  }
};

export default function axis(options = {}, chart) {
  let ret = d3.svg.axis(), {
    accessor,
    scale,
    orient,
    tickSize,
    ticks,
    tickValues,
    innerTickSize,
    outerTickSize,
    tickPadding,
    tickFormat,
    visible = true,
    className = ''
  } = options;
  extend(ret, {
    visible: visible,
    accessor: accessor,
    fn: {
      scale: scale,
      ticks: ticks
    },
    chart: chart,
    $el: d3.select('__empty__'),
    className: className
  });
  ret.scale(scale.call(ret, chart));
  addMethods(ret, mixins);
  if (!isNil(orient)) {
    ret.orient(orient);
  }
  if (!isNil(tickSize)) {
    ret.tickSize(tickSize);
  }
  if (!isNil(ticks)) {
    ret.ticks(ticks.call(ret, chart));
  }
  if (!isNil(tickValues)) {
    ret.tickValues(tickValues);
  }
  if (!isNil(innerTickSize)) {
    ret.innerTickSize(innerTickSize);
  }
  if (!isNil(outerTickSize)) {
    ret.outerTickSize(outerTickSize);
  }
  if (!isNil(tickPadding)) {
    ret.tickPadding(tickPadding);
  }
  if (!isNil(tickFormat)) {
    ret.tickFormat(tickFormat);
  }
  return ret;
}