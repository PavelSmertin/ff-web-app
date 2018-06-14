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


const HIGHCHARTS_PRODUCT = {
  Highmaps: 'Highmaps',
  Highstock: 'Highstock',
}

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
    if (!this.getChart() && this.options) {
      this.init()
    }
  },

  methods: {
    getChart() {
      return this.chart
    },

    addSeries(options) {
      this.delegateMethod('addSeries', options)
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

    initHigcharts(product) {},

    init() {
      if (!this.getChart() && this.options) {
        StockInit(Highcharts)
        this.chart = new Highcharts['StockChart'](this.$el, this.options)
      }
    },
  },

  watch: {
    options: function(options) {
      if (!this.getChart() && options) {
        this.init()
      } else {
        this.getChart().update(this.options)
      }
    },
  },

  beforeDestroy() {
    if (this.getChart()) {
      this.getChart().destroy()
    }
  },
}
</script>