export const DrilldownOptions = {

  navigator: {
    adaptToUpdatedData: true,
    series: []
  },

  scrollbar: {
    liveRedraw: false
  },

  title: {
    text: ''
  },

  subtitle: {
    text: ''
  },

  chart: {
    margin: [0, 0, 0, 0]
  },

  rangeSelector: {
    buttons: [{
        type: 'hour',
        count: 1,
        text: '1ч'
    }, {
        type: 'day',
        count: 1,
        text: '1д'
    }, {
        type: 'month',
        count: 1,
        text: '1м'
    }, {
        type: 'year',
        count: 1,
        text: '1г'
    }, {
        type: 'all',
        text: 'ВСЕ'
    }],
    inputEnabled: false, // it supports only days
    selected: 4 // all
  },

  xAxis: {
    // events: {
    //     afterSetExtremes: afterSetExtremes
    // },
    gridZIndex: 3,
    crosshair: { zIndex: 4 },
    minRange: 3600 * 1000, // one hour
    minorTickInterval: 'auto',
    startOnTick: true,
    endOnTick: true
  },

  yAxis: {
    gridZIndex: 3,

    opposite: true,
    crosshair: { zIndex: 4 },
    labels: {
        align: 'left',
        format: '{value:.2f}',
        y: 6,
        x: 2
    }
  },

  plotOptions: {
    series: {
        // general options for all series
      tooltip: {
          valueDecimals: 2
      },
      threshold: null,
    },
    line: {
      zIndex: 50,
    },
    area: {
      zIndex: 50,
    }
  },
  series: {
    type: 'area',
  },

}
