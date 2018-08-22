import Vuex from 'vuex'

const MAX_SOCKET_COUNT = 10

const createStore = () => {
	return new Vuex.Store({
		state: {
			isMenuOpen: false,
			authUser: null,
			coins: [],
			favoriteCoins: [],
			subscribedCoins: [],
			currentSocketCoins: [],
			updateSocketCoins: [],
			pageSocketCoin: {},
			news: [],
			topNews: [],
			filters: {symbol: null, type: null}
		},

		mutations: {
			SET_USER: function (state, user) {
				state.authUser = user
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

				if( state.pageSocketCoin.symbol == up.symbol ) {
					state.pageSocketCoin.up = up.price - state.pageSocketCoin.price_usd >= 0 ? true : false
					state.pageSocketCoin.price_usd = up.price
				}
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
			SET_CURRENT_SOCKET_COINS: function (state, socketCoins) {
				state.currentSocketCoins = socketCoins
			},
			PUSH_SOCKET_COIN: function (state, socketCoin) {
				if( state.updateSocketCoins.indexOf(socketCoin) === -1 ) {
					state.updateSocketCoins.push(socketCoin)
					if( state.updateSocketCoins.length > MAX_SOCKET_COUNT ) {
						state.updateSocketCoins.splice( 0, state.updateSocketCoins.length - MAX_SOCKET_COUNT )
					}
				}
			},
			SET_PAGE_SOCKET_COIN: function (state, coin) {
				state.pageSocketCoin = coin
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