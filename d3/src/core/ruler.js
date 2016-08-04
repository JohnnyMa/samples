import d3 from 'd3';
import 'extension/selection.js';
import { draggable } from 'core/behavior.js';
import { isNil } from 'helpers/utils.js';

function vertical(chart, offset) {
  let valueX = chart.axes.x.scale().invert(offset);

  function yIndexAccessor(s, valueX) {
    let index = d3.bisector(chart.axes.x.accessor).left(s.data, valueX), prev;
    if (index >= s.data.length) {
      index = s.data.length - 1;
    }
    prev = index - 1 < 0 ? index : index - 1;
    return valueX - chart.axes.x.accessor(s.data[prev]) > chart.axes.x.accessor(s.data[index]) - valueX ? index : prev;
  }

  chart.ruler.$el.selectAll('.point')
    .attr('transform', function(s) {
      let yOffset = chart.axes.y.scale()(
        chart.axes.y.accessor(s.data[yIndexAccessor(s, valueX)])
      );
      return `translate(0, ${yOffset})`;
    });
  chart.ruler.$el.selectAll('.tips').attr('transform', function(s, i) {
    if (offset > chart.width / 2) {
      return `translate(-3, ${20*i + 20})`;
    }
    return `translate(3, ${20*i + 20})`;
  });
  chart.ruler.$el.selectAll('.tips-text')
    .text(function(s) {
      return chart.axes.y.accessor(s.data[yIndexAccessor(s, valueX)]);
    })
    .attr('text-anchor', function() {
      if (offset > chart.width / 2) {
        return 'end';
      }
      return 'start';
    });
}

function horizontal(chart, offset) {
  let valueY = chart.axes.y.scale().invert(offset);

  function xIndexAccessor(s, valueY) {
    let index = d3.bisector(chart.axes.y.accessor).left(s.data, valueY), prev;
    if (index >= s.data.length) {
      index = s.data.length - 1;
    }
    prev = index - 1 < 0 ? index : index - 1;
    return valueY - chart.axes.y.accessor(s.data[prev]) > chart.axes.y.accessor(s.data[index]) - valueY ? index : prev;
  }

  chart.ruler.$el.selectAll('.point')
    .attr('transform', function(s) {
      let xOffset = chart.axes.x.scale()(
        chart.axes.x.accessor(s.data[xIndexAccessor(s, valueY)])
      );
      return `translate(${xOffset}, 0)`;
    });
  chart.ruler.$el.selectAll('.tips').attr('transform', function(s, i) {
    if (offset > chart.height / 2) {
      return `translate(${20*i + 20}, -3)`;
    }
    return `translate(${20*i + 20}, 3)`;
  });
  chart.ruler.$el.selectAll('.tips-text')
    .text(function(s) {
      return chart.axes.x.accessor(s.data[xIndexAccessor(s, valueY)]);
    })
    .attr('text-anchor', function() {
      if (offset > chart.height / 2) {
        return 'end';
      }
      return 'start';
    });
}

export default class Ruler {
  constructor(chart, options = {}) {
    let {
      mode = 'hover',
      orient = 'vertical'
    } = options;
    this.chart = chart;
    this.mode = mode;
    this.orient = orient;
    this.$el = d3.select('__empty__');
  }
  draw() {
    let chart = this.chart;
    if (!this.$el.empty()) {
      return this;
    }
    this.$el = chart.$el.append('g').classed('ruler', true);
    if (this.orient === 'vertical') {
      this.$el.classed('vertical', true);
      this.$el.append('rect')
        .classed('ruler-bar', true)
        .attr('width', this.mode === 'hover' ? 2 : 50)
        .attr('height', chart.height)
        .attr('x', this.mode === 'hover' ? -1 : -25)
        .style('fill', 'none');
      // line
      this.$el.append('line')
        .attr('class', 'line')
        .attr('y1', 0)
        .attr('y2', chart.height);
    } else {
      this.$el.classed('horizontal', true);
      // line
      this.$el.append('line')
        .attr('class', 'line')
        .attr('x1', 0)
        .attr('x2', chart.width);
    }
    // tips
    this.$el.selectAll('.tips')
      .data(chart.series)
      .enter()
     .append('g')
      .attr('class', 'tips')
     .append('text')
      .attr('class', 'tips-text')
      .style('fill', function(s) {
          return chart.color(s.name);
      });
    // point
    this.$el.selectAll('.point')
      .data(chart.series)
      .enter()
     .append('g')
      .attr('class', 'point')
     .append('circle')
     .attr('r', 7)
     .style('fill', function(s) { return chart.color(s.name); });
    this.$el.selectAll('.point')
     .append('circle')
      .attr('r', 3)
      .style('fill', '#fff');
    if (this.mode === 'hover') {
      this.$el.hide();
    } else {
      this.$el.show();
    }
    return this;
  }
  stick() {
    let offset = d3.transform(this.$el.attr('transform')).translate[
      this.orient === 'vertical' ? 0 : 1
    ];
    this.move(offset);
  }
  move(offset) {
    if (this.$el.style('display') === 'none') {
      return this;
    }
    if (isNil(offset)) {
      offset = d3.mouse(this.chart.$el.node())[(this.orient === 'vertical' ? 0 : 1)];
    }
    if (isNaN(offset)) {
      offset = this.orient === 'vertical' ? this.chart.width / 2 : this.height / 2;
    }
    if (offset < 0 || offset > this.chart.width) {
      return this;
    }
    if (this.orient === 'vertical') {
      this.$el.attr('transform', `translate(${offset}, 0)`);
      vertical(this.chart, offset);
    } else {
      this.$el.attr('transform', `translate(0, ${offset})`);
      horizontal(this.chart, offset);
    }
    return this;
  }
  center() {
    return this.move(
      this.orient === 'vertical' ? this.chart.width / 2 : this.chart.height / 2
    );
  }
  bind(overlay, dispatch) {
    let ruler = this;
    function mouseover() {
      ruler.$el.classed('dragging', true);
      ruler.$el.show();
    }
    function mouseout() {
      ruler.$el.classed('dragging', false);
      ruler.$el.hide();
    }
    function mousemove() {
      ruler.move();
    }
    function dragstart() {
      ruler.$el.classed('dragging', true);
      if (d3.event.sourceEvent) {
        d3.event.sourceEvent.stopPropagation();
      }
    }
    function drag() {
      ruler.move();
    }
    function dragend() {
      ruler.$el.classed('dragging', false);
    }
    if (this.mode === 'hover') {
      this.$el.style('pointer-events', 'none');
      dispatch.on(`dragstart.${this.chart.id}`, mouseover)
        .on(`drag.${this.chart.id}`, mousemove)
        .on(`dragend.${this.chart.id}`, mouseout);
      d3.select(overlay).on('mouseover', dispatch.dragstart)
      .on('mouseout', dispatch.dragend)
      .on('mousemove', dispatch.drag);
    } else {
      this.$el.style('pointer-events', 'all');
      dispatch.on(`dragstart.${this.chart.id}`, dragstart)
        .on(`drag.${this.chart.id}`, drag)
        .on(`dragend.${this.chart.id}`, dragend);
      draggable(this.$el.node(), dispatch);
    }
    return this;
  }
}