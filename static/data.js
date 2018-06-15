export const DrilldownOptions = {

  type: 'area',
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
    gridZIndex: 2,
    crosshair: { zIndex: 4 },
    minRange: 3600 * 1000, // one hour
    minorTickInterval: 'auto',
    startOnTick: true,
    endOnTick: true,

    plotLines: [{
      color: 'red',
      width: 2,
      zIndex: 500
    }],
  },

  yAxis: {
    gridZIndex: 2,

    opposite: true,
    crosshair: { zIndex: 4 },
    labels: {
        align: 'left',
        format: '{value:.2f}',
        y: 6,
        x: 2
    },
    plotLines: [{
      color: 'red',
      width: 2,
      zIndex: 500
    }],

  },


  tooltip: {
    style: {
      color: '#FFFFFF',
      padding: 0
    },
    valuePrefix: '$',
    shape: 'circle',
    shadow: false,
    valueDecimals: 2,
    borderRadius: 0,
    borderWidth: 0,
    pointFormat: '{point.y}'
  },

  plotOptions: {
    series: {
        // general options for all series
      tooltip: {
          valueDecimals: 2
      },
      threshold: null,
      zIndex: 50,
      marker: {
        radius: 1,
        lineColor: '#000000',
        fillColor: '#000000',
      },
      states: {
        hover: {
            halo: false
        }
      }
    },
  },
  series: {
    type: 'area',
    zIndex: 50,

  },

}
