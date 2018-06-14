import Vue from 'vue'
import HighchartsVue from 'highcharts-vue/src'

  import Highcharts from 'highcharts/highcharts.src'
  import StockInit from 'highcharts/modules/stock.src'

  console.log('stockChart1')
  console.log(Highcharts['stockChart'])
  StockInit(Highcharts)

  console.log('stockChart2')
  console.log(Highcharts['stockChart'])

Vue.use(HighchartsVue)