<template> 
  <main class="row ff_index no-gutters">
    <div class="col ff_wrap">
      <ul class="row ff_mobile_tabs">
        <li class="col-3">
          <nuxt-link :to="{name: 'index-coins'}">
            Крипта
          </nuxt-link>
        </li>
        <li class="col-3">
          <nuxt-link :to="{name: 'index'}">
            Новости
          </nuxt-link >
        </li>
      </ul>

      <div class="row ff_content no-gutters">

        <transition name="fade" v-on:before-enter="beforeEnter" v-on:before-leave="beforeLeave" v-on:after-leave="afterLeave">
          <div v-if="$route.name != 'index-coins'" class="ff-left-panel" v-bind:class="colLeft">
            <div class="scroll-container" id="ff_coin_index_scroll">
              <coins-list />
            </div>
          </div>
        </transition>

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
        </div>

        <aside class="ff-right-panel col-md-4" v-bind:class="colRight">

          <div class="news_filters_block">
            <div class="coin_select_tag">Новости {{ upFilterSymbol() }}</div>
            <dropdowns :options="types" :selected="selectedType" v-on:updateOption="filterByType"></dropdowns>
          </div>

          <div class="scroll-container">
            <div v-if="$store.state.news.length" class="ff-news">

              <!-- ssr list -->
              <nuxt-link @click.native="onPostClick(newest.id)" v-for="newest of $store.state.news" v-bind:key="newest.id" :to="linkToPost(newest)" class="ff-news-row">
                <post-item :post="newest" ></post-item>
              </nuxt-link>

              <!-- client list -->
              <nuxt-link @click.native="onPostClick(item.id)" v-for="(item, key) in list" v-bind:key="key" :to="linkToPost(item)" class="ff-news-row">
                <post-item :post="item"></post-item>
              </nuxt-link>

              <infinite-loading @infinite="infiniteHandler" spinner="spiral">
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
  import NewsCoin from '~/components/NewsCoin.vue'
  import Vue from 'vue'
  import InfiniteLoading from 'vue-infinite-loading/src/components/InfiniteLoading.vue'
  import Jsona from 'jsona'
  import { analMixin } from '~/components/mixins/analitics.js'
  import _ from 'lodash'

  const dataFormatter = new Jsona()

  const CURRENTFIELDS = {
      'TYPE'            : 0x0       // hex for binary 0, it is a special case of fields that are always there
    , 'MARKET'          : 0x0       // hex for binary 0, it is a special case of fields that are always there
    , 'FROMSYMBOL'      : 0x0       // hex for binary 0, it is a special case of fields that are always there
    , 'TOSYMBOL'        : 0x0       // hex for binary 0, it is a special case of fields that are always there
    , 'FLAGS'           : 0x0       // hex for binary 0, it is a special case of fields that are always there
    , 'PRICE'           : 0x1       // hex for binary 1
    , 'BID'             : 0x2       // hex for binary 10
    , 'OFFER'           : 0x4       // hex for binary 100
    , 'LASTUPDATE'      : 0x8       // hex for binary 1000
    , 'AVG'             : 0x10      // hex for binary 10000
    , 'LASTVOLUME'      : 0x20      // hex for binary 100000
    , 'LASTVOLUMETO'    : 0x40      // hex for binary 1000000
    , 'LASTTRADEID'     : 0x80      // hex for binary 10000000
    , 'VOLUMEHOUR'      : 0x100     // hex for binary 100000000
    , 'VOLUMEHOURTO'    : 0x200     // hex for binary 1000000000
    , 'VOLUME24HOUR'    : 0x400     // hex for binary 10000000000
    , 'VOLUME24HOURTO'  : 0x800     // hex for binary 100000000000
    , 'OPENHOUR'        : 0x1000    // hex for binary 1000000000000
    , 'HIGHHOUR'        : 0x2000    // hex for binary 10000000000000
    , 'LOWHOUR'         : 0x4000    // hex for binary 100000000000000
    , 'OPEN24HOUR'      : 0x8000    // hex for binary 1000000000000000
    , 'HIGH24HOUR'      : 0x10000   // hex for binary 10000000000000000
    , 'LOW24HOUR'       : 0x20000   // hex for binary 100000000000000000
    , 'LASTMARKET'      : 0x40000   // hex for binary 1000000000000000000, this is a special case and will only appear on CCCAGG messages
  };

  const api_news = `/api/news?include=coins&fields[news-translated]=id,title,votes_positive,votes_negative,create_dt,type,slug,source_url,images`
  const api_coins = `/api/coin/index?fields[portfolio-coins]=symbol,full_name,price_usd,percent_change24h,market_cap_usd,volume24h_usd,available_supply`
  const api_coins_favorites =  `api/user/myself?include=favoritecoins,subscribedcoins`

  export default {

    mixins: [ analMixin ],

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
          { hid: 'og:image', property: 'og:image', content: process.env.baseUrl + '/FF_cover968_b.png' },
          { hid: 'twitter:image', name: 'twitter:image', content: process.env.baseUrl + '/FF_cover968_b.png' },

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
        meta: {current_page: 1},
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
        fadeForRedirect: false,
      }
    },

    async asyncData ({ route }) {
      return {
        isMarketCup: route.name == 'index-coins',
      }
    },

    async fetch ({ app, store, params, route }) {

      if( params.symbol ) {
        store.commit('SET_FILTER_SYMBOL', params.symbol)
      }
      if( route.name == 'index' ) {
        store.commit('SET_FILTER_SYMBOL', 'BTC')
      }

      let requests =  [
        app.$axios.get( apiNewsPrepare(store.state.filters) ),
        app.$axios.get( api_coins ),
      ]

      let [ news, coins ] = await Promise.all(requests)

      let newsObj = dataFormatter.deserialize( news.data )

      store.commit( 'SET_NEWS', newsObj )

      if( newsObj && newsObj.length > 0 ) {
        let tops = newsObj.slice(0, 2).map( post => post.id )
        store.commit( 'SET_TOP_NEWS', tops )
      }
      store.commit( 'SET_COINS', coins.data )

      try {
        if( app.$auth.loggedIn ) {
          let favoriteCoins = await app.$axios.get(api_coins_favorites)
          let responseObj = dataFormatter.deserialize( favoriteCoins.data )
          store.commit('SET_FAVORITE_COINS', responseObj.favoritecoins)
          store.commit('SET_SUBSCRIBED_COINS', responseObj.subscribedcoins)
        }
      } catch (e) {
        console.log(e.message)
      }
    },

    components: {
      VueTimeago,
      InfiniteLoading,
      Dropdowns,
      PostItem,
      CoinsList,
      NewsCoin,
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
          this.back = { path: `/${from.params.symbol}` }
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
            let newsObj = dataFormatter.deserialize( data )

            this.list = this.list.concat( newsObj )
            $state.loaded()
          } else {
            $state.complete()
          }
        })
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

            let newsObj = dataFormatter.deserialize( data )
            this.$store.commit('SET_NEWS', newsObj)
            this.list = []
            this.meta = {current_page: 1}
            this.isFiltering = false

          }).catch(e => {
            this.isFiltering = false
          })
      },
      onClose: function () {
        this.sendEvent( 'CloseButton', 'close', this.$route.path );
        this.$router.push(this.back)
      },
      beforeEnter: function (el) {
        this.isMarketCup = this.$route.name == 'index-coins' 
      },
      beforeLeave: function (el) {
        this.fadeForRedirect = true 
      },
      afterLeave: function (el) {
        this.isMarketCup = this.$route.name == 'index-coins' 
      },
      linkToPost: function (post) {
        if( post.slug ) {
          return { name: 'slug-id', params: { id: post.id, slug: post.slug, newest:  post, }}
        } else {
          return { name: 'index-symbol-id', params: { 
              symbol: this.$route.params.symbol ? this.$route.params.symbol : 'btc',
              id: post.id, 
              newest:  post,
            }
          }

        }
      },
      upFilterSymbol: function () {
        return upSymbol(this.$store.state.filters.symbol)
      },
      onPostClick: function ( postId ) {
        this.sendEvent( 'NewsPanel', 'click', postId );
      },
      dataUnpack(message) {
        var data = this.unpack(message);

        if( !data['PRICE'] ) {
          return
        }
        // if(!data['OPEN24HOUR']) {
        //   return;
        // }
        // var delta = ((data['PRICE'] - data['OPEN24HOUR']) / data['OPEN24HOUR'] * 100).toFixed(2);
        // console.log(data['FROMSYMBOL'], data['PRICE'], delta)

        return { symbol: data['FROMSYMBOL'], price: data['PRICE'], volume24h: data['VOLUME24HOUR'] } //, delta: delta};
      },
      unpack(value) {
        var valuesArray = value.split( "~" )
        var valuesArrayLenght = valuesArray.length
        var mask = valuesArray[valuesArrayLenght-1]
        var maskInt = parseInt( mask,16 )
        var unpackedCurrent = {}
        var currentField = 0
        for( var property in CURRENTFIELDS ) {
          if(CURRENTFIELDS[property] === 0) {
            unpackedCurrent[property] = valuesArray[ currentField ]
            currentField++
          }  else if(maskInt & CURRENTFIELDS[property]){
            if( property === 'LASTMARKET' ){
              unpackedCurrent[property] = valuesArray[ currentField ]
            } else {
              unpackedCurrent[property] = parseFloat( valuesArray[currentField] )
            }
            currentField++
          }
        }

        return unpackedCurrent
      },
      getSubscribtions() {
        return this.$store.state.socketCoins.map( coin => `5~CCCAGG~${coin}~USDT` )
      }
    },

    socket: {
      events: {
        m( msg ) {
          var change = this.dataUnpack(msg);
          if( change ) {
            this.$store.commit( 'UPDATE_COIN_PRICE', change )
          }
        },
        connect() {
          //this.$socket.emit( 'SubAdd', { subs: this.getSubscribtions() })
        },
        disconnect() {
          console.log( "Websocket disconnected from " + this.$socket.nsp )
        },
        error( err ) {
          console.error( "Websocket error!", err )
        },
        changed( msg ) {
          console.log( "Something changed: " + msg )
        }

      }
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
      },

      '$store.state.updateSocketCoins':  _.debounce( function ( newValue ) {

        // Удалим из сокета монеты, которые не видно, исключая монету со страницы монеты
        let remove  =  this.$store.state.currentSocketCoins.filter( 
          coin => -1 === newValue.indexOf( coin ) &&  this.$store.state.pageSocketCoin.symbol !=  coin
        )
        let add =  newValue.filter( 
          coin => -1 === this.$store.state.currentSocketCoins.indexOf( coin ) 
        )

        this.$store.commit( 'SET_CURRENT_SOCKET_COINS', newValue.slice() )
        this.$socket.emit( 'SubAdd', { subs: add.map( coin => `5~CCCAGG~${coin}~USDT` ) })
        this.$socket.emit( 'SubRemove', { subs: remove.map( coin => `5~CCCAGG~${coin}~USDT` ) })

      }, 1000 )
    },

    computed: {
      colLeft: function () {
        return {
          'col-md-1': this.$route.name != 'index-coins',
        }
      },
      colCenter: function () {
        return {
          'col-md-8': this.isMarketCup,
          'col-md-7': !this.isMarketCup,
          'fade_for_redirect': this.fadeForRedirect,
          'col-12': this.activePane == 'center_pane',
          'active_center': this.activePane == 'center_pane',
        }
      },

      colRight: function () {
        return {
          'col-12': this.$route.name == 'index' || this.$route.name == 'index-symbol',
          'active_right': this.$route.name == 'index' || this.$route.name == 'index-symbol',
        }
      },


      showPost: function () {
        return this.$route.name == 'index-symbol-id' || this.$route.name == 'slug-id' || (this.$route.name.indexOf('wiki') > 0)
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

  function upSymbol( value ) {
    if( value ) {
      return value.toUpperCase()
    } else {
      return null
    }
  }

  function apiNewsPrepare( filters ) {
    let filterQuery = 
      (filters.type ? '&filters[news-translated][type]=' + filters.type : '') + 
      (filters.symbol ? '&filters[portfolio-coins][symbol]=' + upSymbol(filters.symbol) : '')

    return api_news + filterQuery
  }

</script>