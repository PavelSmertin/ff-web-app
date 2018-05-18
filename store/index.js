import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = () => new Vuex.Store({

  state: {
    news: []
  },
  mutations: {
    setNews (state, news) {
      state.news = news
  	}
  }
})

export default store