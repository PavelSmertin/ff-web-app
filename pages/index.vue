<template> 
  <main class="ff_index">
    <div class="ff_wrap">
      <ul class="ff_mobile_tabs" v-if="$route.name != 'index-coins'">
        <li class="tab_item">
          <nuxt-link :to="{name: 'index-coins'}">
            &#9776; Крипта
          </nuxt-link>
        </li>
        <li class="tab_item">
          <span class="caret_right"></span>
        </li>
        <li class="tab_item">
          <span class="ff_mobile_tabs_active"> 
            {{ upFilterSymbol() }}
          </span>
        </li>
      </ul>

      <div class="ff_content" id="ff_content">

        <transition name="fade" v-on:before-enter="beforeEnter" v-on:before-leave="beforeLeave" v-on:after-leave="afterLeave">
          <div v-if="$route.name != 'index-coins'" class="ff_left_panel" v-bind:class="colLeft">
            <div class="scroll-container" id="ff_coin_index_scroll">
              <coins-list />
            </div>
          </div>
        </transition>

        <div class="ff_center_panel" v-bind:class="colCenter" ref="center_pane">

          <div class="ff_scroll_wrap" ref="scroll-container">
            <nuxt-child :key="routeKey"/>
          </div>

          <button v-if="showPost" v-on:click="onClose()" class="ff_close">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 14">
              <path class="stroked" fill="#000" stroke="black" stroke-linecap="square" d="M 4.5 4.5 L 11.5 11.5 M 4.5 11.5 L 11.5 4.5"/>
            </svg>
          </button>

          <button v-if="coinExpand" v-on:click="onClosePane()" class="ff_close_mobile" v-bind:class="coinExpandButton" name="ff_close_mobile">
            <svg id="ic_expand_collapse" viewBox="0 0 24 24" class="svgDemoGraphic">
              <g id="chevron" transform="translate(12,10)">
                <g id="leftBar" transform="rotate(-45)">
                  <g transform="translate(0,3)">
                    <path id="leftBarPath" class="delightIconFillPath" d="M1-4v8h-0.7v-8z"></path>
                  </g>
                </g>
                <g id="rightBar" transform="rotate(225)">
                  <g transform="translate(0,-3)">
                    <path id="rightBarPath" class="delightIconFillPath" d="M1-4v8h-0.7v-8z"></path>
                  </g>
                </g>
              </g>
            </svg>
          </button>

          <button v-else v-on:click="onClosePane()" class="ff_close_mobile" v-bind:class="coinExpandButton">
            <svg id="ic_expand_collapse" viewBox="0 0 24 24" class="svgDemoGraphic">
              <g id="chevron" transform="translate(12,15)">
                <g id="leftBar" transform="rotate(135)">
                  <g transform="translate(0,3)">
                    <path id="leftBarPath" class="delightIconFillPath" d="M1-4v8h-0.7v-8z"></path>
                  </g>
                </g>
                <g id="rightBar" transform="rotate(45)">
                  <g transform="translate(0,-3)">
                    <path id="rightBarPath" class="delightIconFillPath" d="M1-4v8h-0.7v-8z"></path>
                  </g>
                </g>
              </g>
            </svg>
          </button>
        </div>

        <aside class="ff_right_panel" ref="right_pane" v-bind:class="colRight">

          <div class="news_filters_block">
            <a href="#" v-on:click.stop.prevent="filterByType()" class="filters_tab" v-bind:class="activeType()">Все</a>
            <a href="#" v-on:click.stop.prevent="filterByType('news')" class="filters_tab" v-bind:class="activeType('news')">Новости</a>
            <a href="#" v-on:click.stop.prevent="filterByType('prognosis')" class="filters_tab" v-bind:class="activeType('prognosis')">Прогнозы</a>
            <a href="#" v-on:click.stop.prevent="filterByType('signals')" class="filters_tab" v-bind:class="activeType('signals')">Сигналы</a>
          </div>

          <div class="scroll-container" ref="scroll_news">
            <div v-if="$store.state.news.length" class="ff_news ff_right_feed_news">

              <!-- ssr list -->
              <nuxt-link @click.native="onPostClick(newest.id)" v-for="newest of $store.state.news" v-bind:key="newest.id" :to="linkToPost(newest)" class="ff_news_row">
                <post-item :post="newest" ></post-item>
              </nuxt-link>

              <!-- client list -->
              <nuxt-link @click.native="onPostClick(item.id)" v-for="(item, key) in list" v-bind:key="key" :to="linkToPost(item)" class="ff_news_row">
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
  import PostItem from '~/components/PostItem.vue'
  import CoinsList from '~/components/CoinsList.vue'
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

  const api_news = `/api/news?include=coins&fields[news-translated]=id,title,votes_positive,votes_negative,create_dt,type,slug,source_url,images,is_top`
  const api_coins = `/api/coin/index?fields[portfolio-coins]=symbol,full_name,price_usd,percent_change24h,market_cap_usd,volume24h_usd,available_supply`

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
        selectedType: 'all',
        back: { name: 'index' },
        activeTab: null,
        isFiltering: null,
        fadeForRedirect: false,
        coinExpand: false,
        blockTop: 0,
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

      let requests = [
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

    },

    components: {
      VueTimeago,
      InfiniteLoading,
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

      // устанавливаем высоту шапки для мобильной версии
      this.topOffset = this.$refs["scroll_news"].offsetParent === null ? 100 : this.$refs["right_pane"].offsetTop
      this.$refs["scroll_news"].addEventListener('scroll', this.handleScroll, false);

      setInterval(function(obj){
          obj.retriveLatestNews()
      }, 120000, this)

      this.tutorial()

    },

    methods: {

      tutorial() {
        var tu = document.createElement('script')
        tu.type = 'text/javascript'
        tu.async = true
        tu.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'dpi1c6z6qg9qf.cloudfront.net/client/v3/tutorialize.js.gz'
        var sc = document.getElementsByTagName('script')[0]
        sc.parentNode.insertBefore(tu, sc)

        var pushScript = document.createElement("script")
        pushScript.appendChild(document.createTextNode('var _t = _t || [];_t.push = function(){if(typeof window.tutorialize !== "undefined"){window.tutorialize.process(arguments[0]);} return Array.prototype.push.apply(this, arguments);};_t.push({publisher_id: "5b9f875f1cf38f5fc40034d8"});'))

        sc.parentNode.insertBefore(pushScript, sc)

      },

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

            // Добавляем подгруженные новости в клиентский список с проверкой на дубли
            this.list = this.list.concat( 
              newsObj
                .filter( item => this.list.find( el => el.id == item.id ) === undefined ) // client подгруженные новости
                .filter( item => this.$store.state.news.find( el => el.id == item.id ) === undefined ) // ssr новости
            )
            $state.loaded()
          } else {
            $state.complete()
          }
        })
      },
      retriveLatestNews() {
        this.$axios.get(apiNewsPrepare( this.$store.state.filters ), {
          params: {
            page: 1,
          },
        }).then(({ data }) => {
          let newsObj = dataFormatter.deserialize( data )

          // фильтруем дубли в подгруженных
          let latest = newsObj
              .filter( item => this.list.find( el => el.id == item.id ) === undefined ) // client подгруженные новости
              .filter( item => this.$store.state.news.find( el => el.id == item.id ) === undefined ) // ssr новости

          // Добавляем подгруженные новости в ssr список
          this.$store.commit( 'SET_NEWS', latest.concat(this.$store.state.news) )
          this.$store.commit( 'SET_TOP_NEWS', this.$store.state.news.slice(0, 2).map( item => item.id ) )
        })
      },
      filterByType(value) {
        this.$store.commit('SET_FILTER_TYPE', value)
        this.selectedType = value
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

        this.newsScrollToTop()

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
      },
      handleScroll () {
        // this.$refs["scroll_news"].scrollTo( 0, 0 );
        // return;

        var sh = this.$refs["scroll_news"].scrollHeight
        var st = this.$refs["scroll_news"].scrollTop
        var oh = this.$refs["scroll_news"].offsetHeight

        if( st < 0 ) {
          st = 0
        }

        if( st > this.topOffset ) {
          st = this.topOffset
        }
        this.blockTop =  this.topOffset - st
        this.$refs["right_pane"].style.top = this.blockTop +'px'

      },

      onClosePane: function () {
        this.$refs["scroll-container"].scrollTo(0, 0)
        this.coinExpand = !this.coinExpand
      },

      tabCoin: function () {
        return this.$route.params.symbol && this.$route.params.symbol != 'btc' ? upSymbol(this.$route.params.symbol)  : 'Новости'
      },

      activeType: function ( type ) {
        return {
          'active_type': type == this.$store.state.filters.type,
        }
      },

      newsScrollToTop: function () {
        var element = this.$refs["scroll_news"]

        // чтобы шапка не расхлапывалась при смене фильтра
        element.scrollTo(0, this.topOffset-this.blockTop)
      },

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
          'collapse_left_panel': this.isMarketCup,
        }
      },
      colCenter: function () {
        return {
          'expand_center_panel': this.isMarketCup,
          'fade_for_redirect': this.fadeForRedirect,
        }
      },

      colRight: function () {
        return {
          'active_mobile_right': (this.$route.name == 'index' || this.$route.name == 'index-symbol') && !this.coinExpand
        }
      },

      coinExpandButton: function () {
        return {
          'expand': !this.coinExpand,
          'collapse': this.coinExpand,
          'hidden': !(this.$route.name == 'index' || this.$route.name == 'index-symbol'),
        }
      },

      showPost: function () {
        return this.$route.name == 'index-symbol-id' || this.$route.name == 'slug-id' || (this.$route.name.indexOf('wiki') > 0)
      },
      routeKey: function () {
        return this.$route.params.id || this.$route.params.symbol || this.$route.name
      }
    },

    beforeDestroy() {
      this.$refs["scroll_news"].removeEventListener('scroll', this.handleScroll, false)
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