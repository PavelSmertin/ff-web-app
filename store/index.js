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