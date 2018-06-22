<template> 
  <div class="row ff_index no-gutters">
    <div class="col ff_wrap">

      <ul class="row ff_mobile_tabs">
        <li class="col-2"  v-on:click="setLeftTab">
          <span v-bind:class="activeLeftTab">Курсы</span>
        </li>
        <li class="col-2" v-on:click="setRightTab">
          <span v-bind:class="activeRightTab">Новости</span>
        </li>
      </ul>

      <div class="row ff_content no-gutters">
        <div class="ff-left-panel col-md-8" v-bind:class="colLeft">
          <div class="scroll-container">
            <div class="ff_coin_index">
              <div class="coin_header">
                <div class="coin_details_head i_symbol"></div>
                <div class="coin_details_head i_cap">
                  Капитализация
                </div>
                <div class="coin_details_head">
                  Цена
                </div>
                <div class="coin_details_head i_volume">
                  Объем(24ч)
                </div>
                <div class="coin_details_head i_sup">
                  Оборот
                </div>
                <div class="coin_details_head">
                  Цена(%)
                </div>
              </div>

              <div v-for="coin of $store.state.coins" v-bind:key="coin.id" class="currency coin_row">
                <nuxt-link :to="{name: 'index-symbol', params: { symbol: downSymbol(coin.attributes.symbol)}}" class="coin_details_item i_symbol" >
                  {{ coin.attributes.symbol }}
                </nuxt-link>
                <div class="coin_details_item i_cap">
                  ${{ formatPrice(coin.attributes.market_cap_usd) }}
                </div>
                <div class="coin_details_item">
                  ${{ formatPrice(coin.attributes.price_usd) }}
                </div>
                <div class="coin_details_item i_volume">
                  ${{ formatPrice(coin.attributes.volume24h_usd) }}
                </div>
                <div class="coin_details_item i_sup">
                  {{ formatPrice(coin.attributes.available_supply) }} {{ coin.attributes.symbol }}
                </div>
                <div class="coin_details_item change" v-bind:class="{ negative: (coin.attributes.percent_change24h < 0) }">
                  {{ coin.attributes.percent_change24h }}%
                </div>

                <nuxt-link :to="{ name: 'index-symbol',  params: { symbol: downSymbol(coin.attributes.symbol) }}" class="click-area">
                </nuxt-link>
              </div>
            </div>
          </div>
        </div>

        <div class="ff_center_panel col-md-7 offset-md-1" ref="scroll-container" v-bind:class="colCenter">
           <nuxt-child :key="$route.params.id"/>
            <nuxt-link v-on:click="closeContent()" :to="back" class="ff_close">
                <img src="/close.svg" />
            </nuxt-link>
        </div>

        <aside class="ff-right-panel col-md-4" v-bind:class="colRight">
          <div class="news_filters_block">
            <div class="coin_tag">{{ $store.state.filters.symbol }}</div>
            <dropdowns :options="types" :selected="selectedType" v-on:updateOption="filterByType"></dropdowns>
          </div>

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
    </div>
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


    data() {
      return {
        infiniteState: null,
        meta: {current_page: 1} ,
        list: [],
        seenPost: false,
        seenIndex: true,
        types: [
          { name: 'Все новости' }, 
          { name: 'Новость', value: 'news' },
          { name: 'Прогноз', value: 'prognosis' }
        ],
        selectedType: {name: 'Все новости'},
        back: { name: 'index' },
        activeTab: 'left_tab'
      }
    },

    async fetch ({ app, store, params }) {

      if( params.symbol ) {
        store.commit('SET_FILTER_SYMBOL', params.symbol)
      }

      let [news, coins] = await Promise.all([
        app.$axios.get(apiNewsPrepare(store.state.filters)),
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
        // vm.activeTab = 
        //   to.name == 'index-symbol'
        //         ? 'left_tab'  
        //         : to.name == 'index-id' || to.name == 'index-slug'
        //             ? 'right_tab' 
        //             : ''
      })
    },

    beforeRouteUpdate (to, from, next) {

      if(to.name == "index") {
        this.filterBySymbol(null)
        this.back = { name: 'index' } 
      }

      if(to.name == "index-symbol") {
        this.filterBySymbol(to.params.symbol)
        this.back = { name: 'index' } 
      }

      if(from.name == "index-symbol" && to.name != "index") {
        this.back = { name: 'index-symbol', 
          params: { 
            symbol: from.params.symbol
          }
        }
      }

      next();
    },

    methods: {

      infiniteHandler($state) {
        this.infiniteState = $state
        this.$axios.get(apiNewsPrepare(this.$store.state.filters), {
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

      filterByType(payload) {

        this.$store.commit('SET_FILTER_TYPE', payload.value)
        this.selectedType = payload

        if(this.infiniteState) { 
          this.infiniteState.reset()
        }

        let data = this.$axios.get(apiNewsPrepare(this.$store.state.filters)).then(({ data }) => {
          this.$store.commit('SET_NEWS', data.data)
          this.list = []
          this.meta = { current_page: 1 }
        });
      },

      filterBySymbol(symbol) {
        if(upSymbol(this.$store.state.filters.symbol) == upSymbol(symbol)) {
          return
        }

        this.$store.commit('SET_FILTER_SYMBOL', symbol)

        if(this.infiniteState) { 
          this.infiniteState.reset()
        }

        let data = this.$axios.get(apiNewsPrepare(this.$store.state.filters)).then(({ data }) => {
          this.$store.commit('SET_NEWS', data.data)
          this.list = []
          this.meta = {current_page: 1}
        });
      },

      formatPrice(value) {
        let val = (value/1).toFixed(2).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
      },
      downSymbol(value) {
        return value.toLowerCase()
      },
      setRightTab: function () {
        this.activeTab = 'right_tab'
      },
      setLeftTab: function () {
        this.activeTab = 'left_tab'
      },

      closeContent: function () {
        return false
      }
    },

    computed: {
      colLeft: function () {
        return {
          'col-12': this.activeTab == 'left_tab',
          'active_left': this.activeTab == 'left_tab',
        }
      },
      colCenter: function () {
        return {
          'active_content': this.$route.name != 'index',
        }
      },
      colRight: function () {
        return {
          'col-12': this.activeTab == 'right_tab',
          'active_right': this.activeTab == 'right_tab',

        }
      },
      activeRightTab: function () {
        return {
          'active_tab': this.activeTab == 'right_tab',
        }
      },
      activeLeftTab: function () {
        return {
          'active_tab': this.activeTab == 'left_tab',
        }
      }
    },

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

  function apiNewsPrepare(filters) {
    let filterQuery = 
      (filters.type ? '&filters[news-translated][type]=' + filters.type : '') + 
      (filters.symbol ? '&filters[portfolio-coins][symbol]=' + upSymbol(filters.symbol) : '')

    if (filterQuery.length > 0) {
      filterQuery = filterQuery.replace('&','?')
    }

    return api_news + filterQuery
  }

</script>