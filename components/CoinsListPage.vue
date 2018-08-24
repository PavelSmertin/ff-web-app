<template>
  <div class="ff_coin_page">
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

    <nuxt-link 
        @click.native="onCoinClick(coin.attributes.symbol)"
        v-for="coin of $store.state.coins" 
        v-bind:key="coin.id" 
        :to="coinPath(coin)" 
        class="currency coin_row"
      >
      <div class="coin_details_item i_symbol" >
        {{ coin.attributes.symbol }}
      </div>
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
    </nuxt-link>

    <infinite-loading v-if="$store.state.coins.length" @infinite="infiniteHandler" spinner="spiral">
      <span slot="no-more">Вы достигли конца списка</span>
      <span slot="no-results">Вы достигли конца списка</span>
    </infinite-loading>

  </div>
</template>

<script>
  import InfiniteLoading from 'vue-infinite-loading/src/components/InfiniteLoading.vue'

  import { analMixin } from '~/components/mixins/analitics.js'

  const api_coins = `/api/coin/index?fields[portfolio-coins]=symbol,full_name,price_usd,percent_change24h,market_cap_usd,volume24h_usd,available_supply`

  export default {
    name: 'coins-list-page',

    components: {
      InfiniteLoading,
    },

    mixins: [ analMixin ],

    data() {
      return {
        isFiltering: null,
        infiniteState: null,
      }
    },



    methods: {
      formatPrice(value) {
        let val = (value/1).toFixed(2).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
      },
      downSymbol(value) {
        return value.toLowerCase()
      },
      coinPath( coin ) {
        if( coin.attributes.symbol == 'BTC') {
          return { name: 'index' }
        }

        return { name: 'index-symbol',  params: { symbol: this.downSymbol(coin.attributes.symbol) }}
      },
      onCoinClick: function ( symbol ) {
        this.sendEvent( 'MarketCup', 'click', symbol );
      },

      infiniteHandler( $state ) {
        this.infiniteState = $state
        this.$axios.get(apiCoinsPrepare(), {
          params: {
            page: this.$store.state.coinsMeta.current_page + 1,
          },
        })
        .then(({ data }) => {
          if( this.$store.state.coinsMeta.current_page < data.meta.page_count ) {
            let coinsObj = data.data
            this.$store.commit( 'APPEND_COINS', data )
            $state.loaded()
          } else {
            $state.complete()
          }
        });
      },

      filter() {
        this.isFiltering = true
        if(this.infiniteState) { 
          this.infiniteState.reset()
        }

        let data = this.$axios.get(apiCoinsPrepare( this.meta.current_page ), {
          params: {
            request: 'BTC',
          },
        })
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
    }
  }
  function apiCoinsPrepare( page ) {
    return api_coins
  }

  function upSymbol( value ) {
    if( value ) {
      return value.toUpperCase()
    } else {
      return null
    }
  }
</script>