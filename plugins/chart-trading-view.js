import Vue from 'vue'
import ChartTradingView from '~/components/ChartTradingView.vue'

if (process.BROWSER_BUILD) {
	Vue.use( ChartTradingView )
}