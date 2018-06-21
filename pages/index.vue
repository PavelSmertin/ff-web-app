<template> 
  <div class="row ff-content no-gutters">

    <div class="ff-left-panel" v-bind:class="colLeft">
      <div class="scroll-container">

        <div class="ff_coins">
          <div class="coin_header">
            <div class="coin_details_head">
              Ресурс
            </div>
          </div>
          <div v-for="coin of $store.state.coins" v-bind:key="coin.id" class="currency">
            <nuxt-link :to="{ name: 'index-symbol',  params: { symbol: downSymbol(coin.attributes.symbol) }}" >
              {{ coin.attributes.symbol }}
            </nuxt-link>
            <nuxt-link :to="{ name: 'index-symbol',  params: { symbol: downSymbol(coin.attributes.symbol) }}" class="click-area">
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>

    <main class="ff-center-panel" v-bind:class="colCenter">
      <div class="scroll-container" ref="scroll-container">
        <nuxt-child :key="$route.params.id"/>
      </div>
      <nuxt-link v-if="seenPost" v-on:click="closeContent()" :to="{name: 'index'}" class="ff-close">
          <img src="/close.svg" />
      </nuxt-link>
    </main>

    <aside class="ff-right-panel col-12 col-md-4">

      <ul class="right_tabs">
        <li  v-on:click="seenIndex = true" class="right_tab">
          <span v-bind:class="{ active_tab: seenIndex }">Курсы</span>
        </li>
        <li v-on:click="seenIndex = false" class="right_tab">
          <span v-bind:class="{ active_tab: !seenIndex }">Новости</span>
        </li>
      </ul>

      <dropdowns :options="arrayOfObjects" :selected="object" v-on:updateOption="methodToRunOnSelect"></dropdowns>

      <div class="scroll-container">
        <div v-if="$store.state.news.length" class="ff-news">

          <div v-for="newest of $store.state.news" v-bind:key="newest.id" class="ff-news-row">
            <div class="ff-news-cell">
              <div class="row">
                <div class="col">
                  <nuxt-link v-if="newest.attributes.slug" :to="{ 
                            name: 'slug-id', 
                            params: { 
                                id: newest.id, 
                                slug: newest.attributes.slug, 
                                newest:  newest.attributes }}"
                            class="ff-nc-title"
                            >
                      {{newest.attributes.title}}
                  </nuxt-link>

                  <nuxt-link v-else :to="{ 
                            name: 'index-id', 
                            params: { 
                                id: newest.id,
                                newest:  newest.attributes }}"
                            class="ff-nc-title"
                            >
                      {{newest.attributes.title}}
                  </nuxt-link>
                </div>
              </div>

              <div class="row">
                <div class="col">
                  <ul class="ff-label news_list_detail">
                    <li><timeago :since="newest.attributes.create_dt" class="time-ago"></timeago></li>
                    <li v-if="newest.attributes.type == 'news'">Новость</li>
                    <li v-else-if="newest.attributes.type == 'prognosis'">Прогноз</li>
                  </ul>
                </div>
              </div>

              <nuxt-link v-if="newest.attributes.slug" :to="{ 
                        name: 'slug-id', 
                        params: { 
                            id: newest.id, 
                            slug: newest.attributes.slug, 
                            newest:  newest.attributes }}" 
                        class="click-area"
                        >
              </nuxt-link>
              <nuxt-link v-else :to="{ 
                        name: 'index-id', 
                        params: { 
                            id: newest.id,
                            newest:  newest.attributes }}" 
                        class="click-area"
                        >
              </nuxt-link>
            </div>
          </div>

          <div v-for="(item, key) in list" v-bind:key="key" class="ff-news-row">
            <div class="ff-news-cell">

              <div class="row">
                <div class="col">
                  <nuxt-link v-if="item.attributes.slug"  :to="{ 
                      name: 'slug-id', 
                      params: { 
                          id: item.id, 
                          slug: item.attributes.slug, 
                          newest:  item.attributes }}" 
                      class="ff-nc-title">
                    {{item.attributes.title}}
                  </nuxt-link>
                  <nuxt-link v-else  :to="{ 
                      name: 'index-id', 
                      params: { 
                          id: item.id,
                          newest:  item.attributes }}" 
                      class="ff-nc-title">
                    {{item.attributes.title}}
                  </nuxt-link>
                </div>
              </div>

              <div class="row">
                <div class="col">
                  <ul class="ff-label news_list_detail">
                    <li><timeago :since="item.attributes.create_dt" class="time-ago"></timeago></li>
                    <li v-if="item.attributes.type == 'news'">Новость</li>
                    <li v-else-if="item.attributes.type == 'prognosis'">Прогноз</li>
                  </ul>
                </div>
              </div>

              <nuxt-link v-if="item.attributes.slug"  :to="{ 
                        name: 'slug-id', 
                        params: { 
                            id: item.id, 
                            slug: item.attributes.slug, 
                            newest:  item.attributes }}" 
                        class="click-area">
              </nuxt-link>
              <nuxt-link v-else  :to="{ 
                        name: 'index-id', 
                        params: { 
                            id: item.id,
                            newest:  item.attributes }}" 
                        class="click-area">
              </nuxt-link>
            </div>
          </div>

          <infinite-loading v-if="$store.state.news.length" @infinite="infiniteHandler" spinner="spiral">
            <span slot="no-more">Вы достигли конца списка</span>
            <span slot="no-results">Вы достигли конца списка</span>
          </infinite-loading>
          
        </div>

      </div> 
    </aside>

  </div>
</template>


<script>
  import VueTimeago from 'vue-timeago'
  import Dropdowns from '~/components/Dropdowns.vue'
  import Vue from 'vue'
  import InfiniteLoading from 'vue-infinite-loading/src/components/InfiniteLoading.vue'

  var MINUTE = 60;
  var HOUR = MINUTE * 60;
  var DAY = HOUR * 24;
  var WEEK = DAY * 7;
  var MONTH = DAY * 30;
  var YEAR = DAY * 365;

  const api_news = process.env.apiUrl + '/v1/news/';
  const api_coins = process.env.apiUrl + '/v1/coin/index?fields[portfolio-coins]=symbol,full_name,price_usd,percent_change24h,market_cap_usd,volume24h_usd,available_supply';

  export default {

    async asyncData({ app, params, error }) {

      var apiNewsFiltered = api_news

      let filters = {}
      if( params.symbol ) {
        filters = { symbol: params.symbol }
        // apiNewsFiltered = app.filterBySymbol(params.symbol)
      }
    },

    data() {
      return {
        infiniteState: null,
        meta: {current_page: 1},
        list: [],
        seenPost: false,
        seenIndex: true,
        arrayOfObjects: [
          { name: 'Все новости' }, 
          { name: 'Новость', value: 'news' },
          { name: 'Прогноз', value: 'prognosis' }
        ],
        object: {
          name: 'Все новости',
        },
        apiNewsPrepared: api_news,
        filters: {}

      }
    },

    async fetch ({ app, store }) {

      let [news, coins] = await Promise.all([
        app.$axios.get(api_news),
        app.$axios.get(api_coins),
      ])

      store.commit('SET_NEWS', news.data.data)
      store.commit('SET_COINS', coins.data.data)

    },

    components: {
      VueTimeago,
      InfiniteLoading,
      Dropdowns
    },

    beforeRouteEnter (to, from, next) {
      next(vm => {
        // Экземпляр компонента доступен как `vm`
        vm.seenPost = to.name != "index";
      })
    },

    beforeRouteUpdate (to, from, next) {
      this.seenPost = to.name != "index";

      if(to.name == "index") {
        this.filterBySymbol(null)
      }

      if(to.name == "index-symbol") {
        this.filterBySymbol(to.params.symbol)
      }
      next();
    },

    methods: {

      infiniteHandler($state) {
        this.infiniteState = $state
        this.$axios.get(this.apiNewsPrepared, {
          params: {
            page: this.meta.current_page + 1,
          },
        }).then(({ data }) => {
          if (this.meta.current_page < data.meta.page_count) {
            this.meta = data.meta
            this.list = this.list.concat(data.data)
            $state.loaded()
          } else {
            $state.complete()
          }
        });
      }, 
      closeContent() {
        this.seenIndex = false;
      },

      methodToRunOnSelect(payload) {

        this.filters.type = payload.value;

        if(this.infiniteState) { 
          this.infiniteState.reset()
        }
        this.object = payload

        let filterQuery = 
          (this.filters.type ? '&filters[news-translated][type]=' + this.filters.type : '') + 
          (this.filters.symbol ? '&filters[portfolio-coins][symbol]=' + upSymbol(this.filters.symbol) : '')

        if (filterQuery.length > 0) {
          filterQuery = filterQuery.replace('&','?')
        }

        this.apiNewsPrepared = api_news + filterQuery

        let data = this.$axios.get(this.apiNewsPrepared).then(({ data }) => {
          this.$store.commit('SET_NEWS', data.data)
          this.list = []
          this.meta = { current_page: 1 }
        });
      },

      filterBySymbol(symbol) {
        if(upSymbol(this.filters.symbol) == upSymbol(symbol)) {
          return
        }

        this.filters.symbol = symbol
        if(this.infiniteState) { 
          this.infiniteState.reset()
        }

        let filterQuery = 
          (this.filters.type ? '&filters[news-translated][type]=' + this.filters.type : '') + 
          (this.filters.symbol ? '&filters[portfolio-coins][symbol]=' + upSymbol(this.filters.symbol) : '')

        if (filterQuery.length > 0) {
          filterQuery = filterQuery.replace('&','?')
        }

        this.apiNewsPrepared = api_news + filterQuery

        let data = this.$axios.get(this.apiNewsPrepared).then(({ data }) => {
          this.$store.commit('SET_NEWS', data.data)
          this.list = []
          this.meta = {current_page: 1}
        });
      },

      downSymbol(value) {
        return value.toLowerCase()
      }

    },

    computed: {
      colLeft: function () {
        return {
          'home': this.$route.name == 'index',
          'col-md-1': this.$route.name != 'index',
          //'col-md-1': true,
        }
      },
      colCenter: function () {
        return {
          'col-md-7': this.$route.name != 'index',
          'col-md-8': this.$route.name == 'index',
          'content_float': this.seenIndex || this.seenPost, 
          'content_post': this.seenPost,
          //'col-md-7': true,

        }
      }
    },
    // computed: {
    //   news: {
    //     get () {
    //       console.log('news get')
    //       return this.$store.state.news
    //     },
    //     set (value) {
    //       console.log('news set');
    //       this.$store.commit('setNews', value)
    //     }
    //   }
    // }


  };

  Vue.use(VueTimeago, {
    name: 'timeago', // component name, `timeago` by default
    locale: 'ru-RU',
    locales: {
      // you will need json-loader in webpack 1
      'ru-RU': require('@/assets/locales/ru-RU.json')
    }
  });

  function upSymbol(value) {
    if( value ) {
      return value.toUpperCase()
    } else {
      return null
    }
  }

</script>