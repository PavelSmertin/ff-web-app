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
			coinsMeta: {current_page: 1},
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

				newCoins.forEach( coin => coin.attributes.start = { 
					price_usd: coin.attributes.price_usd / (1 + coin.attributes.percent_change24h/100),
				})

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

			APPEND_COINS: function (state, data) {
				data.data.forEach( coin => coin.attributes.start = { 
					price_usd: coin.attributes.price_usd / (1 + coin.attributes.percent_change24h/100),
				})

				let add =  data.data.filter( 
		          coin => undefined == state.coins.find( stored => coin.id == stored.id ) 
		        )

				state.coins = state.coins.concat( add )

				state.coinsMeta = data.meta
			},

			UPDATE_COIN_PRICE: function (state, up) {
				state.coins.map( coin => {
					if( coin.attributes.symbol ==  up.symbol ){
						coin.attributes.up = up.price - coin.attributes.price_usd >= 0 ? true : false
						coin.attributes.price_usd = up.price
						coin.attributes.percent_change24h 	= ((up.price - coin.attributes.start.price_usd) / coin.attributes.start.price_usd * 100).toFixed(2)
					}
					return coin
				})

				if( state.pageSocketCoin.symbol == up.symbol ) {
					state.pageSocketCoin.up = up.price - state.pageSocketCoin.price_usd >= 0 ? true : false
					state.pageSocketCoin.price_usd = up.price

					state.pageSocketCoin.percent_change24h 	= ((up.price - state.pageSocketCoin.start.price_usd) / state.pageSocketCoin.start.price_usd * 100).toFixed(2)
					state.pageSocketCoin.percent_change1h 	= ((up.price - state.pageSocketCoin.start.price_usd_1h) / state.pageSocketCoin.start.price_usd_1h * 100).toFixed(2)
					state.pageSocketCoin.percent_change7d 	= ((up.price - state.pageSocketCoin.start.price_usd_7d) / state.pageSocketCoin.start.price_usd_7d * 100).toFixed(2)
					state.pageSocketCoin.change1h_usd = up.price - state.pageSocketCoin.start.change1h_usd
					state.pageSocketCoin.change24h_usd = up.price - state.pageSocketCoin.start.change24h_usd
					state.pageSocketCoin.change7d_usd = up.price - state.pageSocketCoin.start.change7d_usd
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
				state.pageSocketCoin.start = {
					price_usd: coin.price_usd / ( 1 + coin.percent_change24h / 100 ),
					price_usd_1h: coin.price_usd / ( 1 + coin.percent_change1h / 100 ),
					price_usd_7d: coin.price_usd / ( 1 + coin.percent_change7d / 100 ),
					change1h_usd: coin.price_usd - coin.change1h_usd,
					change24h_usd: coin.price_usd - coin.change24h_usd,
					change7d_usd: coin.price_usd - coin.change7d_usd,
				}
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