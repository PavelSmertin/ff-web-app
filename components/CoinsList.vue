<template>
  <div class="ff_coin_index" id="ff_coin_index">
    <transition name="tooltip">
      <div v-if="showTooltip" class="ff_tooltip" v-bind:style="{top: topOfTooltip + 'px' }">
        {{ tooltip }}
      </div>
    </transition>

    <nuxt-link @click.native="sendEvent( 'CoinsPanel', 'open', 'MarketCup' )" :to="{name: 'index-coins'}" class="coin_details_head button_more">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="ic_more">
        <path d="M0 0h24v24H0z" fill="none"/>
        <path fill="#999" id="path" d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
      </svg>
    </nuxt-link>
      
    <div class="coin_tools">
      <form autocomplete="off">
        <input class="coin_search" type="text" name="coin" v-model="$store.state.coinsSearch" placeholder="Поиск">
      </form>
    </div>
    
    <div class="coin_header">
      <div class="coin_details_head i_symbol">
<!--         <form autocomplete="off">
          <input class="coin_search" type="text" v-model="$store.state.coinsSearch" name="coin">
        </form> -->
      </div>
      <div class="coin_details_head">
        Цена
      </div>
      <div class="coin_details_head">
        Цена(%)
      </div>

    </div>


    <div 
        v-for="coin of $store.state.coins" 
        v-bind:key="coin.id" 
        v-on:mouseover="mouseOver($event, coin.attributes.full_name)"
        v-on:mouseleave="mouseLeave"
        class="mouseover_wrap"
      >
      <nuxt-link 
        @click.native="onCoinClick(coin.attributes.symbol)"
        :to="coinPath(coin)" 
        class="coin_row"
        v-observe-visibility="( isVisible, entry ) => visibilityChanged( isVisible, entry, coin )">
        <div class="coin_details_item i_symbol" >
          {{ coin.attributes.symbol }} 
          <span class="button_icon ic_star" v-bind:class="activeFavourite( coin.attributes.symbol )"></span>
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

        <div 
          class="coin_details_item change" 
          v-bind:class="{ negative: (coin.attributes.percent_change24h < 0) }"
          >
          {{ coin.attributes.percent_change24h }}%
        </div>
      </nuxt-link>
    </div>

    <infinite-loading v-if="$store.state.coins.length" @infinite="infiniteHandler" spinner="spiral">
      <span slot="no-more">Вы достигли конца списка</span>
      <span slot="no-results">Вы достигли конца списка</span>
    </infinite-loading>

    <div class="fading" v-bind:class="{ filtered: isFiltering }"></div>

  </div>
</template>

<script>

  import InfiniteLoading from 'vue-infinite-loading/src/components/InfiniteLoading.vue'
  import _ from 'lodash'

  import { coinsMixin } from '~/components/mixins/coins.js'
  import { analMixin } from '~/components/mixins/analitics.js'

  const api_coins = `/api/coin/index?fields[portfolio-coins]=symbol,full_name,price_usd,percent_change24h,market_cap_usd,volume24h_usd,available_supply`

  export default {
    name: 'coins-list',
    data() {
      return {
        tooltip: null,
        topOfTooltip: 0,
        showTooltip: false,
        isFiltering: null,
        infiniteState: null,
      }
    },

    components: {
      InfiniteLoading,
    },

    mixins: [ coinsMixin, analMixin  ],

    methods: {
      mouseOver( event, name ) {
        this.showTooltip = true

        let coinRow = getCoinRow( event.target )
        if( coinRow ) {
          let scrollBlock = document.getElementById('ff_coin_index_scroll')
          this.topOfTooltip = coinRow.offsetTop - scrollBlock.scrollTop
          this.tooltip = name
        }
      },
      mouseLeave() {
        this.showTooltip = false
      },
      activeFavourite: function ( coin ) {
        return {
          'active_star': this.inFavourites( coin )
        }
      },
      inFavourites( coin ) {
        return this.$store.state.favoriteCoins && this.$store.state.favoriteCoins.find( favorite =>  favorite.symbol == coin )
      },
      onCoinClick: function ( symbol ) {
        this.sendEvent( 'CoinsPanel', 'click', symbol );
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
        this.$axios.get(this.apiCoinsPrepare(), {
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

    mounted () {
      document.getElementById('ff_coin_index').getElementsByClassName('coin_search').item(0).focus()
    },

    watch: {
      '$store.state.coinsSearch':  _.debounce( function ( newValue ) {
        this.filter()
      }, 500 )
    }

  }

  function getCoinRow( element, deep = 3 ) {
    if ( element.className.indexOf('coin_row') >= 0 ) {
      return element
    }

    let parentElement = element.parentElement
    if ( parentElement.className.indexOf('coin_row') >= 0 ) {
      return parentElement
    }

    if ( deep-- <= 0 ) {
      return null
    } 
    getCoinRow( parentElement, deep )

  }

  function upSymbol( value ) {
    if( value ) {
      return value.toUpperCase()
    } else {
      return null
    }
  }


</script>