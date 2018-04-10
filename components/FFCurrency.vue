<template>

	<div class="currencies">

		<a v-for="coin of coins" v-bind:key="coin.id" href="/news/bitcoin/" class="currency">
			<span class="name">BTC</span> 
			<span class="value"><span class="dollar">$</span>6695.1</span> 
			<span class="perc neg">-2.08%</span> 
			<span title="Follow" class="icon follow-icon icon-star-two"></span>
		</a>

		<span class="currency currency-note">
			Use search to follow more currencies
		</span>

	</div>


</template>

<script>

	import axios from 'axios'

	export default {
		data (context) {
			return { coins: [] }
		},

		created() {
			axios.get(`http://api.crypto.ff.ru/v1/coin`)
			.then(response => {
				this.coins = response.data.data
			}).catch(e => {
				this.error = e
			})
		}
	}

	// export default {
	//   async asyncData({ params, error }) {
	//   	console.log('export default')
	//     try {
	//       const { data } = await axios.get(`http://192.168.0.106/v1/coin`)
	//       return data.data
	//     } catch (e) {
	//       error({ message: 'Coins not found', statusCode: 404 })
	//     }
	//   },

	//   head() {
	//     return {
	//       title: this.name
	//     }
	//   }
	// }

</script>
