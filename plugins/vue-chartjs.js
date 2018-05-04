import Vue from 'vue'
import { Line } from 'vue-chartjs'

Vue.component('coin-line', {
	extends: Line,
	props: ['data', 'options', 'width', 'height'],
	mounted () {
		this.renderChart(this.data, this.options)
	}
})