<template>
  <section class="ff_coin">

    <div class="coin_head_block">
      <div class="coin_title">
        <h1>Курс {{ getCase() }}</h1>

        <div class="coin_btns">
          <button class="subscribe" v-on:click="subscribe()">
            <div v-if="inSubscribed()">Отписаться</div>
            <div v-else>Подписаться</div>
          </button>
          <nuxt-link v-if="isActiveCoin(attributes.symbol)" class="button_buy_coin" :to="coinBuyUrl( attributes.symbol )">
            Купить {{attributes.symbol}}
          </nuxt-link>
        </div>
      </div>

      <div class="coin_price">
        <div>
          <transition name="slide-fade" mode="out-in">
            <span 
              :key="price()" 
              class="coin_value"
              v-bind:class="isUp( attributes )"
            >
              ${{ price() }}
            </span>
          </transition>
          &nbsp;
          <span class="coin_unit">USD</span>&nbsp;
          <span class="coin_value positive" v-bind:class="{ negative: (attributes.percent_change24h < 0) }">
            {{ attributes.percent_change24h }}%
          </span>
        </div>
        <div class="coin_info_wrap">
          <span class="coin_info">{{ attributes.price_btc }} BTC</span>&nbsp;
        </div>
      </div>
    </div>

    <div class="coin_details_block content_padding">

      <div class="coin_detail_unit">
        <div class="ff_label">Капитализация</div>
        <div class="coin_detail">{{ formatPrice(attributes.market_cap_usd) }} USD</div>
        <div class="coin_detail_info">{{ formatPrice(attributes.total_coin_supply) }} {{attributes.symbol }}</div>
      </div>

      <div class="coin_detail_unit">
        <div class="ff_label">Объем торгов (24ч)</div>
        <div class="coin_detail">{{ formatPrice(attributes.volume24h_usd) }} USD</div>
        <div class="coin_detail_info">{{ formatPrice(attributes.volume24h_btc) }} {{ attributes.symbol }}</div>
      </div>

      <div class="coin_detail_unit">
        <div class="ff_label">Изменение (1ч)</div>
        <div class="coin_detail positive" v-bind:class="{ negative: (attributes.change1h_usd < 0) }">
          {{ formatPrice(attributes.percent_change1h) }}%
        </div>
        <div class="coin_detail_info positive" v-bind:class="{ negative: (attributes.change1h_usd < 0) }">
          {{ formatPrice(attributes.change1h_usd) }} USD
        </div>
      </div>

      <div class="coin_detail_unit">
        <div class="ff_label">Изменение (24ч)</div>
        <div class="coin_detail positive" v-bind:class="{ negative: (attributes.change24h_usd < 0) }">
          {{ formatPrice(attributes.percent_change24h) }}%
        </div>
        <div class="coin_detail_info positive" v-bind:class="{ negative: (attributes.change24h_usd < 0) }">
          {{ formatPrice(attributes.change24h_usd) }} USD
        </div>
      </div>

      <div class="coin_detail_unit">
        <div class="ff_label">Изменение (7д)</div>
        <div class="coin_detail positive" v-bind:class="{ negative: (attributes.change7d_usd < 0) }">
          {{ formatPrice(attributes.percent_change7d) }}%
        </div>
        <div class="coin_detail_info positive" v-bind:class="{ negative: (attributes.change7d_usd < 0) }">
          {{ formatPrice(attributes.change7d_usd) }} USD
        </div>
      </div>
    </div>

    <div class="tt_graph_wrap margin24" v-bind:class="tradingViewClass">

      <div class="filters" v-if="$store.state.graphs[symbol] !== undefined">
        <ttFilters :label="'период'" :options="intervalOptions" :selectedProp="$store.state.graphFilters.period"  v-on:updateOption="filter($event, 'period')" />
      </div>

      <div class="tt_graph_head content_padding" v-if="$store.state.graphs[symbol] !== undefined">
         <h2>Доля {{ symbol }} в портфелях трейдеров</h2>
        <a href="https://tt.ff.ru" rel="noopener" target="_blank" class="button_tt_link">Узнать больше</a>
      </div>

      <no-ssr v-if="$store.state.graphs[symbol] == undefined" placeholder="Loading...">
        <chart-trading-view 
          :symbol="ticker"
        />
      </no-ssr>

      <ttGraph
        v-else
        class="border_top tt_graph"
        :symbol="symbol"
        :first="{color: '#8FCC14', gradient: 'GradientFirst', opacity: 1 }" 
        :second="{color: '#000', gradient: 'GradientSecond', opacity: 0.2 }"
        :interactive="true" 
      />

      <div v-if="$store.state.graphs[symbol] !== undefined && $store.state.filterLoading" class="loading"></div>
    </div>

    <div class="border_top"></div>
    <section v-if="attributes.seo_text" class="ff_text_block margin60" v-html="attributes.seo_text">
    </section>

  </section>
</template>


<script>
  import { analMixin } from '~/components/mixins/analitics.js'
  import { coinsMixin } from '~/components/mixins/coins.js'
  import { indacoinMixin } from '~/components/mixins/indacoin.js'
  import ttGraph from '~/components/ttGraph.vue'
  import ttFilters from '~/components/ttFilters.vue'

  import _ from 'lodash'
  import Jsona from 'jsona'

  const REQUEST_GRAPH = `/api/portfolios/coin-graph/`

  const dataFormatter = new Jsona()

  export default {

    components: {
      ttGraph,
      ttFilters,
    },

    mixins: [ analMixin, indacoinMixin, coinsMixin ],

    head() {
      return {
        title: this.title(),
        meta: [
          { 
            hid: 'description', 
            name: 'description', 
            content: this.headDescription,
          },

          { hid: 'og:type', property: 'og:type', content: 'website' },
          { hid: 'og:url', property: 'og:url', content: process.env.baseUrl },
          { hid: 'og:image', property: 'og:image', content: process.env.baseUrl + this.getImageSharing() },
          { hid: 'twitter:image', name: 'twitter:image', content: process.env.baseUrl + this.getImageSharing() },

          { hid: 'og:title', property: 'og:title', content: `Курс ${this.attributes.full_name} на сегодня -  FF.ru` },
          { hid: 'og:description', property: 'og:description', content: this.headDescription },
          { hid: 'twitter:title', name: 'twitter:title', content: `Курс ${this.attributes.full_name} на сегодня -  FF.ru` },
          { hid: 'twitter:description', name: 'twitter:description', content: this.headDescription },
        ],

      }
    },

    data() {
      return {
        intervalOptions: [
          { name: 'Сутки', value: '1d' },
          { name: 'Неделя', value: '1w' },
          { name: 'Месяц', value: '1m' },
        ],
      }
    },

    async asyncData ({ app, params, error, isDev }) {

      let attributes = {}
      let headDescription
      let symbol = upSymbol( params.symbol )
      let tsym = symbol == 'USDT' ? 'USD' : 'USDT'
      let ticker = `${symbol}/${tsym}`

      try {
        let details = await app.$axios.get(`/api/coin/full-list?per-page=2000&filters[portfolio-coins][symbol]=${symbol}`)
        if( details.data.data && details.data.data.length > 0 ) {
          attributes = details.data.data[0].attributes
          headDescription = getDescription(attributes)
        }
      } catch (e) {
      } 

      return { 
        attributes, 
        headDescription, 
        symbol: symbol,
        tsym:   tsym,
        ticker: ticker,
      }
    },

    mounted () {
      this.goto()
      this.watchSocketCoin()

      if( this.$store.state.graphs[this.symbol] == undefined ) {
        this.retrieveGraph()
      }
    },

    computed: {
      tradingViewClass: function () {
        return {
          'trading_view_adapt': this.$store.state.graphs[this.symbol] == undefined
        }
      }
    },

    methods: {
      goto() {
        var element = this.$parent.$parent.$refs["scroll-container"];
        element.scrollTo(0, 0);
      },
      getImageSharing() {
        return '/FF_cover968_b.png'
      },
      getCase() {
        return this.symbol == 'BTC' ? getCase(this.attributes) : this.attributes.coin_name
      },
      subscribe() {
        this.sendEvent( 'CoinSubscribe', 'subscribe', this.symbol );
        this.$axios.post(`/api/coin/subscribe?include=subscribedcoins`, `symbol=${ this.symbol}`)
          .then(({ data }) => {
            let response = dataFormatter.deserialize( data )
            this.$store.commit('SET_SUBSCRIBED_COINS', response.subscribedcoins)
          }).catch(e => {
            if (e.response && e.response.status == 401) {
              this.$router.push({ name: `account-signin` })
            }
          })
      },
      inSubscribed() {
        return this.$store.state.subscribedCoins && this.$store.state.subscribedCoins.find( coin =>  coin.symbol == this.symbol )
      },
      price() {
        let coin = this.$store.state.coins.find( coin => coin.attributes.symbol == this.symbol )
        if( coin ) {
          return this.formatPrice( coin.attributes.price_usd )
        }

        if( this.$store.state.pageSocketCoin 
            && this.$store.state.pageSocketCoin.attributes 
            && this.$store.state.pageSocketCoin.attributes.price_usd ) {
          return this.formatPrice( this.$store.state.pageSocketCoin.attributes.price_usd )
        }
        return this.formatPrice( this.attributes.price_usd )
      },
      title() {
        if( process.server ) {
          return getTitle( this.attributes )
        } else {
          return `${this.price()}$ ${this.dinamic()}${this.attributes.percent_change24h}% — Курс ${this.symbol} на сегодня к доллару/рублю. График курса ${this.symbol}`
        }
      },
      dinamic() {
        return this.attributes.percent_change24h > 0 ? '▲' : '▼'
      },
      watchSocketCoin() {
        if( this.$store.state.pageSocketCoin ) {
          this.$socket.emit( 'SubRemove', {subs: [`5~CCCAGG~${this.$store.state.pageSocketCoin.symbol}~${this.tsym}`]} )
        }
        this.$store.commit( 'SET_PAGE_SOCKET_COIN', this.attributes )
        this.$socket.emit( 'SubAdd', { subs: [`5~CCCAGG~${this.symbol}~${this.tsym}`] })
      },
      isUp: function ( coin ) {
        return {
          'up': coin.up,
          'down': !coin.up,
        }
      },
      async retrieveGraph () {
        var nodes = []

        try {
          const data = await this.$axios.get(requestGraph( this.symbol, this.$store.state.graphFilters ))
          this.$store.commit( 'SET_GRAPH', {symbol: this.symbol, data: data.data[this.symbol]} )
        } catch( e ) {
          if( process.env.NODE_ENV == 'development' ) {
            console.error(e)
          }
        }
      },
      filter ( filter, type ) {
        this.$store.commit( 'SET_GRAPH_FILTER', { type: type, value: filter.value } )
      },

    },

    watch: {
      '$store.state.graphFilters': {
        handler: _.debounce( async function ( newValue ) {
          await this.retrieveGraph()
          this.$store.commit( 'TERMINATE_GRAPH_FILTER_LOADING' )
        }, 100 ),
        deep: true
      },
    },
  }

  function requestGraph( symbol, filters ) {
    let filterQuery = 
          ( filters.cap ? '?cap=' + filters.cap : '' ) + 
          ( filters.period ? '&period=' + filters.period : '' ) +
          ( filters.profit ? '&profit=' + filters.profit : '' )
    return REQUEST_GRAPH + symbol +  filterQuery
  }

  function upSymbol(value) {
    if(value) {
      return value.toUpperCase()
    }
  }

  function getTitle (params) {
    if( params.meta_title ) {
      return params.meta_title
    }
    return `Курс ${params.coin_name} на сегодня к доллару/рублю. График курса ${getCase(params)}`
  }

  function getDescription (params) {
    if( params.meta_description ) {
      return params.meta_description
    }
    return `Курс ${params.full_name} онлайн на графике к доллару. Актуальные новости и прогноз цены ${getCase(params)} на сегодня, неделю, месяц`
  }

  function getCase (params) {
    if(params.cases && params.cases.ro) {
      return params.cases.ro
    }
    if(params.cases && params.cases.im) {
      return params.cases.im
    }
    return params.coin_name
  }

</script>