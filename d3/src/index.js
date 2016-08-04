import d3 from 'd3';
import newYorkTemp from 'shared/temperature-New-York.csv';
import sanFTemp from 'shared/temperature-San-Francisco.csv';
import Chart from 'core/chart.js';
import Series from 'core/series.js';
import { randomInt } from 'helpers/math.js';

let series = [];

[newYorkTemp, sanFTemp].forEach(function(data) {
  data.forEach(function(datum) {
    datum.date = d3.time.format('%Y%m%d').parse(datum.date);
    datum.value = +datum.value;
  });
});

series.push(new Series('New York', newYorkTemp));
series.push(new Series('San-Francisco', sanFTemp));

function timeScale(chart) {
  let axis = this;
  return d3.time.scale()
    .range([0, chart.width])
    .domain([
      d3.min(chart.series, function(s) { return d3.min(s.data, axis.accessor); }),
      d3.max(chart.series, function(s) { return d3.max(s.data, axis.accessor); })
    ]);
}

function temperatureScale(chart) {
  let axis = this;
  return d3.scale.linear()
    .range([chart.height, 0])
    .domain([
      d3.min(chart.series, function(s) { return d3.min(s.data, axis.accessor); }),
      d3.max(chart.series, function(s) { return d3.max(s.data, axis.accessor); })
    ]);
}

let dispatch = Chart.dispatch();

new Chart('.cpu-usage', series, {
  height: 200,
  margin: {
    top: 0,
    bottom: 0
  },
  axes: {
    x: {
      accessor(datum) {
        console.log(datum);
        return datum.date;
      },
      scale: timeScale,
      orient: 'bottom',
      visible: false,
      ticks: function ticks(chart) {
        return Math.max(chart.width/75, 2);
      }
    },
    y: {
      accessor(datum) {
        return datum.value;
      },
      scale: temperatureScale,
      orient: 'left',
      visible: false
    }
  },
  ruler: {
    orient: 'vertical',
    mode: 'drag'
  }
}).draw('.line-chart', dispatch);

new Chart('.network-input-output', series, {
  height: 200,
  margin: {
    top: 0
  },
  axes: {
    x: {
      accessor(datum) {
        return datum.date;
      },
      scale: timeScale,
      orient: 'bottom',
      ticks: function ticks(chart) {
        return Math.max(chart.width/75, 2);
      }
    },
    y: {
      accessor(datum) {
        return datum.value;
      },
      scale: temperatureScale,
      orient: 'left',
      visible: false
    }
  },
  ruler: {
    orient: 'vertical',
    mode: 'drag'
  }
}).draw('.line-chart', dispatch);

let disk = new Chart('.disk-read-write', series, {
  height: 200,
  margin: {
    top: 0,
    bottom: 0
  },
  axes: {
    x: {
      accessor(datum) {
        return datum.date;
      },
      scale: timeScale,
      orient: 'bottom',
      visible: false,
      ticks: function ticks(chart) {
        return Math.max(chart.width/75, 2);
      }
    },
    y: {
      accessor(datum) {
        return datum.value;
      },
      scale: temperatureScale,
      orient: 'left',
      visible: false
    }
  },
  ruler: {
    orient: 'vertical',
    mode: 'drag'
  }
}).draw('.line-chart', dispatch);

d3.select('button').on('click', function() {
  disk.download();
});



function realtimeScale(chart) {
  let axis = this;
  return d3.time.scale()
    .range([0, chart.width])
    .domain([
      d3.min(chart.series, function(s) { return axis.accessor(s.data[0]); }),
      d3.max(chart.series, function(s) { return axis.accessor(s.data[s.data.length - 1]); })
    ]);
}

function mockData(count = 1000, initialDate = new Date(2011, 0, 1)) {
  let data = [];
  for (let i = 0; i < count; i++) {
    data.push({
      date: initialDate,
      value: randomInt(20, 40)
    });
    initialDate = nextDate(initialDate);
  }
  return data;
}

function nextDate(date) {
  return new Date((+date) + 60*60*1000*24);
}

let data0 = mockData(20), rtSeries = [
  new Series('node0', data0),
  new Series('node1', data0.map(function(datum) {
    return {
      date: datum.date,
      value: randomInt(1, 20)
    };
  }))
];

let realtime = new Chart('.realtime-chart', rtSeries, {
  height: 200,
  margin: {
    top: 20,
    left: 40,
    bottom: 30
  },
  zoomer: false,
  axes: {
    x: {
      accessor(datum) {
        return datum.date;
      },
      scale: realtimeScale,
      orient: 'bottom',
      ticks: function ticks(chart) {
        return Math.max(chart.width/75, 2);
      }
    },
    y: {
      accessor(datum) {
        return datum.value;
      },
      scale: temperatureScale,
      orient: 'left'
    }
  },
  ruler: {
    orient: 'vertical',
    mode: 'hover'
  }
}).draw(null, dispatch);

function getRealtimeData() {
  let lastDate = rtSeries[0].data[rtSeries[0].data.length - 1].date,
    plusDate = nextDate(lastDate);
  for (let rt of rtSeries) {
    rt.data.push({
      date: plusDate,
      value: randomInt(1, 40)
    });
  }
  realtime.datachange();
  for (let rt of rtSeries) {
    rt.data.shift();
  }
  window.setTimeout(getRealtimeData, 1000);
}

getRealtimeData();

