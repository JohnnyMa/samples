import d3 from 'd3';

export default class ShapeGenerator {
  constructor(generator, chart) {
    this.generator = generator;
    this.chart = chart;
    this.$el = d3.select('__empty__');
  }
  draw() {}
  datachange() {}
  redraw() {}
  gen(data) {
    return this.generator(data);
  }
}