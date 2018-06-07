import Vuex from 'vuex'


const createStore = () => {
	return new Vuex.Store({
		state: {
			isMenuOpen: false,
			authUser: null
		},

		mutations: {
			SET_USER: function (state, user) {
				state.authUser = user
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