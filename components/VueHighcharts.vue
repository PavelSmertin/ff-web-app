<template>
  <div
    :class="classname"
    :style="styles"
  >
  </div>
</template>

<script>
import Highcharts from 'highcharts'
import StockInit from 'highcharts/modules/stock'


export default {
  props: {
    classname: {
      type: String,
      default: 'vue-highcharts',
    },
    styles: {
      type: Object,
      default: function() {
        return {}
      },
    },
    options: Object,
    callback: Function,
  },
  name: 'VueHighcharts',
  data() {
    return {
      chart: null,
    }
  },
  mounted() {

    if (!this.getChart()) {
      if(this.options) {
        this.init()
      }
    } else {
      //this.getChart().init()
      this.getChart().destroy()
      this.chart = new Highcharts.StockChart(this.$el, this.options, this.callback())

    }
  },

  methods: {
    getChart() {
      //return this.chart
      //return Highcharts.charts[0]
      return Highcharts.charts.find(function(element, index, array){ return element != undefined })
    },

    addSeries(options) {
      this.delegateMethod('addSeries', options)
    },
    setData(data) {
      if(this.getChart().series[0]) {
        //this.getChart().series[0].setData(data, true)
      } else {
        this.addSeries(data)
      }
    },
    removeSeries() {
      while (this.getChart().series.length !== 0) {
        this.getChart().series[0].remove()
      }
    },
    mergeOption(options) {
      this.delegateMethod('update', options)
    },
    showLoading(txt) {
      this.getChart().showLoading(txt)
    },
    hideLoading() {
      this.getChart().hideLoading()
    },
    delegateMethod(name, ...args) {
      if (!this.getChart()) {
        return
      }
      return this.getChart()[name](...args)
    },


    init() {
      if (!this.getChart() && this.options) {
        let chart = Highcharts.charts.find(function(element, index, array){ return element != undefined })
        if(!chart) {
          StockInit(Highcharts)
          this.chart = new Highcharts.StockChart(this.$el, this.options, this.callback())
          //Highcharts.charts = Highcharts.charts.filter(function(n){ return typeof element !== "undefined" })
        } 
      }
    },
  },

  // watch: {
  //   options: function(options) {
  //     if (!this.getChart() && options) {
  //       this.init()
  //     } else {
  //       this.getChart().update(this.options)
  //     }
  //   },
  // },

  beforeDestroy() {
    if (this.getChart()) {
      //this.getChart().destroy()
      // Highcharts.charts = Highcharts.charts.filter(function(n){ return true })
      // this.chart = null
    }
  },
}
</script>