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

        <transition name="fade" v-on:after-leave="afterLeave">
          <div v-if="centralFade" class="ff_center_panel col-md-7 offset-md-1" ref="scroll-container">
            <nuxt-child :key="$route.params.id"/>
            <button v-on:click="onClose()" class="ff_close">
              <svg width="106px" height="106px" viewBox="0 0 106 106" id="ff_close">
                <defs>
                  <circle id="path-1" cx="24" cy="24" r="24"></circle>
                  <filter x="-104.2%" y="-83.3%" width="308.3%" height="308.3%" filterUnits="objectBoundingBox" id="filter-2">
                    <feOffset dx="0" dy="10" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
                    <feGaussianBlur stdDeviation="15" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
                    <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.15 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix>
                  </filter>
                </defs>
                <g transform="translate(-890.000000, -211.000000)">
                  <g transform="translate(928.000000, 230.000000)">
                    <g>
                      <use fill="black" fill-opacity="1" filter="url(#filter-2)" xlink:href="#path-1"></use>
                      <use fill="#FFFFFF" fill-rule="evenodd" xlink:href="#path-1"></use>
                    </g>
                    <polygon id="close" fill="#000000" points="19 19.8 23.2 24.0000063 19 28.2 19.8 29 24 24.8 28.2 29 29 28.2 24.8 24.0000063 29 19.8 28.2 19 24 23.2 19.8 19"></polygon>
                  </g>
                </g>
              </svg>
            </button>
          </div>
        </transition>

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

                  <div class="row no-gutters">
                    <div class="col-2">
                      <post-votes :positives="newest.attributes.votes_positive" :negatives="newest.attributes.votes_negative">
                      </post-votes>
                    </div>
                    <div class="col-10">
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
                    <div class="col-2">
                      <post-votes :positives="item.attributes.votes_positive" :negatives="item.attributes.votes_negative">
                      </post-votes>
                    </div>
                    <div class="col-10">
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
          <div class="fading" v-bind:class="{ filtered: isFiltering }"></div>

        </aside>
      </div>
    </div>
  </div>
</template>


<script>
  import VueTimeago from 'vue-timeago'
  import Dropdowns from '~/components/Dropdowns.vue'
  import PostVotes from '~/components/PostVotes.vue'
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

    head() {
      return {
        title: 'Рыночная капитализация криптовалют - FF.ru',
        meta: [
          { 
            hid: 'description', 
            name: 'description', 
            content: 'Рыночная капитализация криптовалют, рейтинг криптовалют, графики курса криптовалют в реальном времени, объемы рынка.',
          },
          { hid: 'og:type', property: 'og:type', content: 'website' },
          { hid: 'og:url', property: 'og:url', content: process.env.baseUrl },
          { hid: 'og:image', property: 'og:image', content: process.env.baseUrl + '/FF_cover1080_b.png' },
          { hid: 'twitter:image', name: 'twitter:image', content: process.env.baseUrl + '/FF_cover1080_b.png' },

          { hid: 'og:title', property: 'og:title', content: 'Рыночная капитализация криптовалют - FF.ru' },
          { hid: 'og:description', property: 'og:description', content: 'Рыночная капитализация криптовалют, рейтинг криптовалют, графики курса криптовалют в реальном времени, объемы рынка.' },
          { hid: 'twitter:title', name: 'twitter:title', content: 'Рыночная капитализация криптовалют - FF.ru' },
          { hid: 'twitter:description', name: 'twitter:description', content: 'Рыночная капитализация криптовалют, рейтинг криптовалют, графики курса криптовалют в реальном времени, объемы рынка.' },
        ],
      }
    },

    data() {
      return {
        infiniteState: null,
        meta: {current_page: 1} ,
        list: [],
        types: [
          { name: 'Все новости' }, 
          { name: 'Новость', value: 'news' },
          { name: 'Прогноз', value: 'prognosis' }
        ],
        selectedType: {name: 'Все новости'},
        back: { name: 'index' },
        activeTab: 'left_tab',
        isFiltering: null,
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
      Dropdowns,
      PostVotes,
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
      this.applyBackStack(to, from)
      next();
    },

    mounted () {
      if( this.$route.name == "index-symbol" ) {
        this.filterBySymbol(this.$route.params.symbol)
      }
    },

    methods: {

      applyBackStack(to, from) {
        if(to.name == "index" || to.name == "index-symbol") {
          this.back = { name: 'index' } 
          return
        }

        if(from.name == "index-symbol") {
          this.back = { name: 'index-symbol', 
            params: { 
              symbol: from.params.symbol
            }
          }
          return
        }
      },

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
        this.filter()
      },

      filterBySymbol(symbol) {
        if(upSymbol(this.$store.state.filters.symbol) == upSymbol(symbol)) {
          return
        }
        this.$store.commit('SET_FILTER_SYMBOL', symbol)
        this.filter()
      },

      filter() {
        this.isFiltering = true
        if(this.infiniteState) { 
          this.infiniteState.reset()
        }

        let data = this.$axios.get(apiNewsPrepare(this.$store.state.filters))
          .then(({ data }) => {

            this.$store.commit('SET_NEWS', data.data)
            this.list = []
            this.meta = {current_page: 1}
            this.isFiltering = false

          }).catch(e => {
            this.isFiltering = false
          })
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

      onClose: function () {
        this.$router.push(this.back)
      },
      afterLeave: function (el) {
        //this.$router.push(this.back)
      },
    },

    watch:{
      '$route':  function () {
        if( this.$route.name == "index-symbol" ) {
          this.filterBySymbol(this.$route.params.symbol)
        }
      }
    },

    computed: {
      colLeft: function () {
        return {
          'col-12': this.activeTab == 'left_tab',
          'active_left': this.activeTab == 'left_tab',
        }
      },
      centralFade: function () {
        return this.$route.name != 'index'
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