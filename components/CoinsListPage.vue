<template>
  <div class="ff_coin_page">
    <div class="coin_tools">
      <form autocomplete="off">
        <input class="coin_search" type="text" name="coin" v-model="$store.state.coinsSearch" placeholder="Поиск...">
      </form>
    </div>
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
      <div class="coin_details_head">&nbsp;</div>
    </div>


    <nuxt-link
        @click.native.self="onCoinClick(coin.attributes.symbol)"
        v-for="coin of $store.state.coins" 
        v-bind:key="coin.id"
        :to="coinPath(coin)" 
        class="coin_row"
        v-observe-visibility="( isVisible, entry ) => visibilityChanged( isVisible, entry, coin )"
      >
      <div class="coin_details_item i_symbol">
        {{ coin.attributes.symbol }}
      </div>
      <div class="coin_details_item i_cap">
        ${{ formatPrice(coin.attributes.market_cap_usd) }}
      </div>

      <transition name="slide-fade" mode="out-in">
        <div 
          :key="coin.attributes.price_usd" 
          class="coin_details_item i_price" 
          v-bind:class="isUp( coin )"
          >
          ${{ formatPrice(coin.attributes.price_usd) }}
        </div>
      </transition>

      <transition name="slide-fade" mode="out-in">
        <div 
          :key="coin.attributes.price_usd" 
          class="coin_details_item i_volume" 
          v-bind:class="isUp( coin )"
          >
          ${{ formatPrice(coin.attributes.volume24h_usd) }}
        </div>
      </transition>
      
      <div class="coin_details_item i_sup">
        {{ formatPrice(coin.attributes.available_supply) }} {{ coin.attributes.symbol }}
      </div>
      <div class="coin_details_item change" v-bind:class="{ negative: (coin.attributes.percent_change24h < 0) }">
        {{ coin.attributes.percent_change24h }}%
      </div>
      <div class="coin_details_item btn">
        <button
          v-if="isActiveCoin(coin.attributes.symbol)"
          v-on:click.stop.prevent="onBuyClick(coin.attributes.symbol)"
          class="button_buy_coin"
          >
            Купить
        </button>
      </div>
    </nuxt-link>

    <infinite-loading v-if="$store.state.coins.length" @infinite="infiniteHandler" spinner="spiral">
      <span slot="no-more">Вы достигли конца списка</span>
      <span slot="no-results">Вы достигли конца списка</span>
    </infinite-loading>

    <div class="fading" v-bind:class="{ filtered: isFiltering }"></div>

  </div>
</template>

<script>
  import InfiniteLoading from 'vue-infinite-loading'
  import _ from 'lodash'

  import { analMixin } from '~/components/mixins/analitics.js'
  import { coinsMixin } from '~/components/mixins/coins.js'
  import { indacoinMixin } from '~/components/mixins/indacoin.js'


  const api_coins = `/api/coin/index?fields[portfolio-coins]=symbol,full_name,price_usd,percent_change24h,market_cap_usd,volume24h_usd,available_supply`

  export default {
    name: 'coins-list-page',

    components: {
      InfiniteLoading,
    },

    mixins: [ coinsMixin, analMixin, indacoinMixin ],

    data() {
      return {
        isFiltering: null,
        infiniteState: null,
      }
    },

    methods: {
      onCoinClick: function ( symbol ) {
        this.sendEvent( 'MarketCup', 'click', symbol );
      },

      onBuyClick: function ( symbol ) {
        this.$router.push({ path: this.coinBuyUrl( symbol ) })
        return false
      },

      isUp: function ( coin ) {
        return {
          'up': coin.attributes.up,
          'down': !coin.attributes.up,
        }
      },

      visibilityChanged( isVisible, entry, coin ) {
        if( isVisible ) {
          this.$store.commit( 'PUSH_SOCKET_COIN', coin.attributes.symbol )
        }
      },

      infiniteHandler( $state ) {
        this.infiniteState = $state
        this.$axios.get(this.apiCoinsPrepare( ), {
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

      filter( symbol ) {
        this.isFiltering = true
        if(this.infiniteState) { 
          this.infiniteState.reset()
        }


        let data = this.$axios.get(this.apiCoinsPrepare(), {
            params: {
              page: 1,
            },
          })
          .then(({ data }) => {
            this.$store.commit('SET_COINS', data)
            this.isFiltering = false
          }).catch(e => {
            this.isFiltering = false
          })
      },

      apiCoinsPrepare( page ) {
        if( this.$store.state.coinsSearch ) {
          return api_coins + '&request=' + this.$store.state.coinsSearch
        } 
        return api_coins
      }
    },

    watch:{
      '$store.state.coinsSearch':  _.debounce( function ( newValue ) {
        this.filter()
      }, 500 )
    },
  }



  function upSymbol( value ) {
    if( value ) {
      return value.toUpperCase()
    } else {
      return null
    }
  }
</script>