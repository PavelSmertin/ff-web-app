import Vuex from 'vuex'


const createStore = () => {
	return new Vuex.Store({
		state: {
			isMenuOpen: false,
			authUser: null,
			coins: [],
			news: [],
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
			}
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