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
            {{attributes.percent_change24h}}%
          </span>
        </div>
        <div>
          <span class="coin-info">{{ attributes.price_btc }} BTC</span>&nbsp;
        </div>
      </div>
    </div>

  </section>
</template>


<script>
  import Vue from 'vue'
  import { analMixin } from '~/components/mixins/analitics.js'
  import Jsona from 'jsona'

  const dataFormatter = new Jsona()

  export default {

    mixins: [ analMixin ],

    data() {
      return {
        enabled: true,
        showLine: false,
        attributes: {},
      }
    },

    async asyncData ({ app, params, error }) {
      return { 
        symbol: upSymbol( params.symbol ),
      }
    },

    computed: {
      activeFavourite: function () {
        return {
          'active_star': this.$store.state.favoriteCoins && this.$store.state.favoriteCoins.find( coin =>  coin.symbol == this.symbol )
        }
      },
    },

    methods: {
      formatPrice(value, percision = 2) {
        let val = (value/1).toFixed(percision)
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
      },
      getBTCCase() {
        return this.symbol == 'BTC' ? getCase(this.attributes, 2) : this.attributes.coin_name
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