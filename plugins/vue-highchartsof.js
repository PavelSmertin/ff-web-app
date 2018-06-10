import Vue from 'vue'
import HighchartsVue from 'highcharts-vue'
import Highcharts from 'highcharts'
import StockInit from 'highcharts/modules/stock.src'

Vue.use(HighchartsVue)
StockInit(Highcharts)