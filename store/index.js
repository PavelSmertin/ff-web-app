import Vuex from 'vuex'


const createStore = () => {
	return new Vuex.Store({
		state: {
			isMenuOpen: false,
			authUser: null,
			coins: [],
			favoriteCoins: [],
			subscribedCoins: [],
			news: [],
			topNews: [],
			filters: {symbol: null, type: null}
		},

		mutations: {
			SET_USER: function (state, user) {
				state.authUser = user
			},
			SET_COINS: function (state, newCoins) {

				if( !(state.favoriteCoins && state.favoriteCoins.length > 0) ) {
					state.coins = newCoins
					return
				}
				
				let favCoins = newCoins.filter( 
						coin => state.favoriteCoins.find( 
							favorite => favorite.id == coin.id  ) != undefined 
						)

				let otherCoins = newCoins.filter( 
						coin => state.favoriteCoins.find( 
							favorite => favorite.id == coin.id  ) == undefined 
						)
				
				state.coins = favCoins.concat(otherCoins)
			},

			UPDATE_COIN_PRICE: function (state, up) {
				state.coins.map( coin => {
					if( coin.attributes.symbol ==  up.symbol ){
						coin.attributes.up = up.price - coin.attributes.price_usd >= 0 ? true : false
						coin.attributes.price_usd = up.price

						//coin.attributes.percent_change24h 	= ((up.price - coin.attributes.open) / coin.attributes.open * 100).toFixed(2)
					}
					return coin
				})
			},
			SET_NEWS: function (state, news) {
				state.news = news
			},
			SET_TOP_NEWS: function (state, topNews) {
				state.topNews = topNews
			},
			SET_FILTER_TYPE: function (state, type) {
				state.filters.type = type
			},
			SET_FILTER_SYMBOL: function (state, symbol) {
				state.filters.symbol = symbol
			},
			SET_FAVORITE_COINS: function (state, favoriteCoins) { 
				
				state.favoriteCoins = favoriteCoins

				if( favoriteCoins == undefined || favoriteCoins.length == 0)  {
					return
				}

				let favCoins = state.coins.filter( 
						coin => state.favoriteCoins.find( 
							favorite => favorite.id == coin.id  ) != undefined 
						)

				let otherCoins = state.coins.filter( 
						coin => state.favoriteCoins.find( 
							favorite => favorite.id == coin.id  ) == undefined 
						)
				
				state.coins = favCoins.concat(otherCoins)
			},
			SET_SUBSCRIBED_COINS: function (state, subscribedCoins) {
				state.subscribedCoins = subscribedCoins
			},
		},

		actions: {
			async nuxtServerInit ({ commit }, { app, params, route }) {
				// if(route.name == 'account-signup-code-code' && params.code) {
				// 	app.$auth.setToken('api', 'djsnjn')
				// 	app.$auth.setUser({})
				// }
			}
		}
	})
}
export default createStore