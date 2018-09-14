<template>
  <section class="ff_coin">

    <div class="row no-gutters margin24">
      <div class="col-12 col-md-6 coin_title" v-on:click="watch()">
        <span class="button_icon ic_star" v-bind:class="activeFavourite"></span>
        <h1>Курс {{ getBTCCase() }}</h1>
      </div>
      <div class="col-12 col-md-6">
        <div>
          <transition name="slide-fade" mode="out-in">
            <span 
              :key="price()" 
              class="coin-value"
              v-bind:class="isUp( attributes )"
            >
              ${{ price() }}
            </span>
          </transition>
          &nbsp;
          <span class="coin-unit">USD</span>&nbsp;
          <span class="coin-value positive" v-bind:class="{ negative: (attributes.percent_change24h < 0) }">
            {{ attributes.percent_change24h }}%
          </span>
        </div>
        <div>
          <span class="coin-info">{{ attributes.price_btc }} BTC</span>&nbsp;
        </div>
      </div>
    </div>

    <div class="row no-gutters coin-details-block coin_mobile">

      <div class="coin_detail_unit col-6 col-md-3">
        <div class="ff-label">Капитализация</div>
        <div class="coin-detail">{{ formatPrice(attributes.market_cap_usd, 0) }} USD</div>
        <div class="coin-detail-info">{{ formatPrice(attributes.total_coin_supply, 0) }} {{attributes.symbol }}</div>
      </div>

      <div class="coin_detail_unit col-6 col-md-3">
        <div class="ff-label">Объем торгов (24ч)</div>
        <div class="coin-detail">{{ formatPrice(attributes.volume24h_usd, 0) }} USD</div>
        <div class="coin-detail-info">{{ formatPrice(attributes.volume24h_btc, 0) }} {{ attributes.symbol }}</div>
      </div>

      <div class="coin_detail_unit col-6 col-md-2">
        <div class="ff-label">Изменение (1ч)</div>
        <div class="coin-detail positive" v-bind:class="{ negative: (attributes.change1h_usd < 0) }">
          {{ formatPrice(attributes.percent_change1h) }}%
        </div>
        <div class="coin-detail-info positive" v-bind:class="{ negative: (attributes.change1h_usd < 0) }">
          {{ formatPrice(attributes.change1h_usd) }} USD
        </div>
      </div>

      <div class="coin_detail_unit col-6 col-md-2">
        <div class="ff-label">Изменение (24ч)</div>
        <div class="coin-detail positive" v-bind:class="{ negative: (attributes.change24h_usd < 0) }">
          {{ formatPrice(attributes.percent_change24h) }}%
        </div>
        <div class="coin-detail-info positive" v-bind:class="{ negative: (attributes.change24h_usd < 0) }">
          {{ formatPrice(attributes.change24h_usd) }} USD
        </div>
      </div>

      <div class="coin_detail_unit col-6 col-md-2">
        <div class="ff-label">Изменение (7д)</div>
        <div class="coin-detail positive" v-bind:class="{ negative: (attributes.change7d_usd < 0) }">
          {{ formatPrice(attributes.percent_change7d) }}%
        </div>
        <div class="coin-detail-info positive" v-bind:class="{ negative: (attributes.change7d_usd < 0) }">
          {{ formatPrice(attributes.change7d_usd) }} USD
        </div>
      </div>
    </div>

    <div class="row no-gutters margin12 coin_mobile">
      <h2>График курса {{ attributes.coin_name }}</h2>
    </div>
    <div class="row no-gutters coin_mobile">
      <no-ssr placeholder="Loading...">
        <chart-trading-view :symbol="ticker"/>
      </no-ssr>
    </div>


    <section v-if="attributes.seo_text" class="row ff_text_block margin60 coin_mobile" v-html="attributes.seo_text"></section>
  </section>
</template>


<script>
  import Vue from 'vue'
  import axios from 'axios'
  import { analMixin } from '~/components/mixins/analitics.js'
  import Jsona from 'jsona'

  const dataFormatter = new Jsona()

  export default {

    mixins: [ analMixin ],

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

    async asyncData ({ app, params, error }) {

      let details
      try {
        details = await app.$axios.get(`/api/coin/full-list?per-page=2000&filters[portfolio-coins][symbol]=${upSymbol(params.symbol)}`)
      } catch (e) {
        if( e.response && e.response.status == 404 ) {
          error ({ message: 'Такой монеты не существует', statusCode: 404 })
          return
        }
      }

      if(!details.data.data || details.data.data.length == 0) {
        error ({ message: 'Такой монеты не существует', statusCode: 404 })
        return
      }

      const { attributes }  = details.data.data[0] 
      let headTitle         = getTitle(attributes)
      let headDescription   = getDescription(attributes)

      let symbol = upSymbol( params.symbol )
      let tsym = symbol == 'USDT' ? 'USD' : 'USDT'

      return { 
        attributes, 
        headTitle, 
        headDescription, 
        downSymbol: downSymbol( params.symbol ), 
        symbol: symbol,
        tsym: tsym,
        ticker:  `${symbol}/${tsym}`
      }
    },


    mounted () {
      this.goto()
      this.watchSocketCoin()
    },

    computed: {
      activeFavourite: function () {
        return {
          'active_star': this.inFavourites()
        }
      },
    },

    methods: {
      goto() {
        var element = this.$parent.$parent.$refs["scroll-container"];
        element.scrollTo(0, 0);
      },
      formatPrice(value, percision = 2) {
        let val = (value/1).toFixed(percision)
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
      },

      getImageSharing() {
        return '/FF_cover968_b.png'
      },

      getBTCCase() {
        return this.symbol == 'BTC' ? getCase(this.attributes, 2) : this.attributes.coin_name
      },
      getCase(value) {
        return getCase(this.attributes, 2)
      },
      callback() {
        return function() {
        }
      },
      watch() {
        this.sendEvent( 'CoinWatch', 'watch', this.symbol );
        this.$axios.post(`/api/coin/favorite?include=favoritecoins`, `symbol=${ this.symbol }`)
          .then(({ data }) => {
            let response = dataFormatter.deserialize( data )
            this.$store.commit('SET_FAVORITE_COINS', response.favoritecoins)
          }).catch(e => {
            if (e.response && e.response.status == 401) {
              this.$router.push({ name: `account-signin` })
            }
          })
      },
      inFavourites() {
        return this.$store.state.favoriteCoins && this.$store.state.favoriteCoins.find( coin =>  coin.symbol == this.symbol )
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
    },

  }


  function upSymbol(value) {
    if(value) {
      return value.toUpperCase()
    }
  }
  function downSymbol( value ) {
    if(value) {
      return value.toLowerCase()
    }
  }

  function getTitle (params) {
    if( params.meta_title ) {
      return params.meta_title
    }
    return `Курс ${params.coin_name} на сегодня к доллару/рублю. График курса ${getCase(params, 2)}`

  }

  function getDescription (params) {
    if( params.meta_description ) {
      return params.meta_description
    }
    return `Курс ${params.full_name} онлайн на графике к доллару. Актуальные новости и прогноз цены ${getCase(params, 2)} на сегодня, неделю, месяц`
  }

  function getCase (params, variant) {
    if(variant == 2) {
      if(params.cases && params.cases.ro) {
        return params.cases.ro
      }
    }

    if(params.cases && params.cases.im) {
      return params.cases.im
    }

    return params.coin_name
  }

</script>