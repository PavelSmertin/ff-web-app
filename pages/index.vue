<template> 
  <main class="row ff_index no-gutters">
    <div class="col ff_wrap">

      <ul class="row ff_mobile_tabs">
        <li class="col-3"  v-on:click="setLeftTab">
          <span v-bind:class="activeLeftTab">Курсы</span>
        </li>
        <li class="col-3" v-on:click="setRightTab">
          <span v-bind:class="activeRightTab">Новости</span>
        </li>
      </ul>

      <div class="row ff_content no-gutters">
        <div class="ff-left-panel" v-bind:class="colLeft">
          <div class="scroll-container">
            <coins-list />
          </div>
        </div>

        <div class="ff_center_panel" v-bind:class="colCenter">

          <div class="ff_scroll_wrap" ref="scroll-container">
            <nuxt-child :key="routeKey"/>
          </div>

          <button v-if="showPost" v-on:click="onClose()" class="ff_close">
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

          <button v-on:click="onClosePane()" class="ff_close_mobile">
            <svg width="106px" height="106px" viewBox="0 0 106 106" id="ff_close">
              <defs>
                <circle id="path-1" cx="24" cy="24" r="24"></circle>
                <filter x="-104.2%" y="-83.3%" width="308.3%" height="308.3%" filterUnits="objectBoundingBox" id="filter-mobile">
                  <feOffset dx="0" dy="10" in="SourceAlpha" result="shadowOffsetOuter2"></feOffset>
                  <feGaussianBlur stdDeviation="15" in="shadowOffsetOuter2" result="shadowBlurOuter1"></feGaussianBlur>
                  <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.15 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix>
                </filter>
              </defs>
              <g transform="translate(-890.000000, -211.000000)">
                <g transform="translate(928.000000, 230.000000)">
                  <g>
                    <use fill="black" fill-opacity="1" filter="url(#filter-mobile)" xlink:href="#path-1"></use>
                    <use fill="#FFFFFF" fill-rule="evenodd" xlink:href="#path-1"></use>
                  </g>
                  <polygon id="close" fill="#000000" points="19 19.8 23.2 24.0000063 19 28.2 19.8 29 24 24.8 28.2 29 29 28.2 24.8 24.0000063 29 19.8 28.2 19 24 23.2 19.8 19"></polygon>
                </g>
              </g>
            </svg>
          </button>
          
        </div>


        <aside class="ff-right-panel col-md-4" v-bind:class="colRight">
          <div class="news_filters_block">
            <div class="coin_tag">{{ $store.state.filters.symbol }}</div>
            <dropdowns :options="types" :selected="selectedType" v-on:updateOption="filterByType"></dropdowns>
          </div>

          <div class="scroll-container">
            <div v-if="$store.state.news.length" class="ff-news">

              <!-- ssr list -->  
              <nuxt-link v-for="newest of $store.state.news" v-bind:key="newest.id" :to="linkToPost(newest)" class="ff-news-row">
                <post-item :post="newest"></post-item>
              </nuxt-link>

              <!-- client list -->              
              <nuxt-link v-for="(item, key) in list" v-bind:key="key" :to="linkToPost(item)" class="ff-news-row">
                <post-item :post="item"></post-item>
              </nuxt-link>

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
  </main>
</template>


<script>
  import VueTimeago from 'vue-timeago'
  import Dropdowns from '~/components/Dropdowns.vue'
  import PostItem from '~/components/PostItem.vue'
  import CoinsList from '~/components/CoinsList.vue'
  import Vue from 'vue'
  import InfiniteLoading from 'vue-infinite-loading/src/components/InfiniteLoading.vue'

  var MINUTE = 60;
  var HOUR = MINUTE * 60;
  var DAY = HOUR * 24;
  var WEEK = DAY * 7;
  var MONTH = DAY * 30;
  var YEAR = DAY * 365;

  const api_news = process.env.apiUrl + '/v1/news/?fields[news-translated]=title,votes_positive,votes_negative,create_dt,type,slug';
  const api_coins = process.env.apiUrl + '/v1/coin/index?fields[portfolio-coins]=symbol,full_name,price_usd,percent_change24h,market_cap_usd,volume24h_usd,available_supply';

  export default {

    transition: {
      name: 'page',
      mode: 'out-in',
      type: 'transition',
    },
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
        activePane: 'center_pane',
        activeTab: null,
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
      PostItem,
      CoinsList,
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
      if( this.$route.name == "index" ) {
        this.filterBySymbol('BTC')
      }

      if( this.$route.name == "index-symbol" ) {
        this.filterBySymbol(this.$route.params.symbol)
      }

      if( this.$route.name == "index-coins" ) {
        this.filterBySymbol(null)
      }
    },

    methods: {

      applyBackStack(to, from) {
        if(to.name == "index" || to.name == "index-symbol") {
          this.back = { name: 'index-coins' } 
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

        if(from.name == "index") {
          this.back = { name: 'index' }
          return
        }

        if(from.name == "index-coins") {
          this.back = { name: 'index-coins' }
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
      setRightTab: function () {
        this.activeTab = 'right_tab'
        this.activePane = 'right_pane'
      },
      setLeftTab: function () {
        this.activeTab = 'left_tab'
        this.activePane = 'left_pane'
      },
      showCentralPane: function () {
        this.activePane = 'center_pane'
      },
      hideCentralPane: function () {
        if( this.activeTab == 'right_tab' ) {
          this.activePane = 'right_pane'
        } else {
          this.activePane = 'left_pane'
        }
      },

      onClose: function () {
        this.$router.push(this.back)
      },
      onClosePane: function () {
        this.hideCentralPane()
      },
      afterLeave: function (el) {
        //this.$router.push(this.back)
      },

      linkToPost: function (post) {
        if( post.attributes.slug ) {
          return { name: 'slug-id', params: { id: post.id, slug: post.attributes.slug, newest:  post.attributes }}
        } else {
          return { name: 'index-id', params: { id: post.id, newest:  post.attributes }}
        }
      },

    },

    watch:{
      '$route':  function () {
        if( this.$route.name == "index" ) {
          this.filterBySymbol('BTC')
        }

        if( this.$route.name == "index-symbol" ) {
          this.filterBySymbol(this.$route.params.symbol)
        }

        if( this.$route.name == "index-coins" ) {
          this.filterBySymbol(null)
        }

        this.showCentralPane()
      }
    },

    computed: {
      colLeft: function () {
        return {
          'col-md-1': this.$route.name != 'index-coins',
          'active_market_cup': this.$route.name == 'index-coins',
          'col-12': this.activePane == 'left_pane',
          'active_left': this.activePane == 'left_pane',
        }
      },
      colCenter: function () {
        return {
          'col-md-8': this.$route.name == 'index-coins',
          'col-md-7': this.$route.name != 'index-coins',
          'col-12': this.activePane == 'center_pane',
          'active_center': this.activePane == 'center_pane',

        }
      },
      colRight: function () {
        return {
          'col-12': this.activePane == 'right_pane',
          'active_right': this.activePane == 'right_pane',

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
      },
      showPost: function () {
        return this.$route.name == 'index-id' || this.$route.name == 'slug-id' || (this.$route.name.indexOf('wiki') > 0)
      },

      routeKey: function () {
        return this.$route.params.id || this.$route.params.symbol || this.$route.name
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

    return api_news + filterQuery
  }

</script>