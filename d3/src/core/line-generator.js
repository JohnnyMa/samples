import d3 from 'd3';
import ShapeGenerator from 'core/shape-generator.js';

export default class LineGenerator extends ShapeGenerator {
  constructor(chart, options = {}) {
    let {
      interpolation = 'step'
    } = options;
    super(
      d3.svg.line().interpolate(interpolation)
        .x(function(datum) { return chart.axes.x.scale()(chart.axes.x.accessor(datum)); })
        .y(function(datum) { return chart.axes.y.scale()(chart.axes.y.accessor(datum)); }),
      chart
    );
  }
  draw() {
    let generator = this, chart = this.chart;
    this.$el = chart.$el.selectAll('.series')
      .data(chart.series)
      .enter()
      .append('g')
      .classed('series', true)
      .attr('clip-path', `url(#clip-path:${chart.id})`);
    this.$el.append('path')
      .classed('line', true)
      .attr('d', function(s) {
        return generator.gen(s.data);
      })
      .style('stroke', function(s) { return chart.color(s.name); });
    return this;
  }
  datachange() {
    return this.redraw();
  }
  translate(interval, direction, animation = {}) {
    let {
      hook,
      time = 500,
      ease = 'linear'
    } = animation, scale = this.chart.axes.x.scale(), translate, baseline;
    baseline = scale.domain()[0];
    translate = scale(baseline - interval);
    if (direction === 'right') {
      translate = -translate;
    }
    this.$el.data(this.chart.series).select('path.line')
      .transition()
      .duration(time)
      .ease(ease)
      .attr('transform', `translate(${translate}, 0)`)
      .each('end', hook);
    return this;
  }
  redraw() {
    let generator = this, series = this.chart.series;
    this.$el.data(series).select('path.line')
      .attr('d', function(s) { return generator.gen(s.data); });
    return this;
  }
}