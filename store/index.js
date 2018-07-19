import Vuex from 'vuex'


const createStore = () => {
	return new Vuex.Store({
		state: {
			isMenuOpen: false,
			authUser: null,
			coins: [],
			news: [],
			feedIds: [],
			topNews: [],
			filters: {symbol: null, type: null}
		},

		mutations: {
			SET_USER: function (state, user) {
				state.authUser = user
			},
			SET_COINS: function (state, coins) {
				state.coins = coins
			},
			SET_NEWS: function (state, news) {
				state.news = news
				state.feedIds = news.map( post =>  post.id )
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