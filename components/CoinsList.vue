<template>
  <div class="ff_coin_index" id="ff_coin_index">
    <transition name="tooltip">
      <div v-if="showTooltip" class="coin_tooltip" v-bind:style="{top: topOfTooltip + 'px' }">
        {{ tooltip }}
      </div>
    </transition>
    <div class="coin_header">
      <div class="coin_details_head i_symbol"><nuxt-link :to="{name: 'index-coins'}">Market Cap</nuxt-link></div>
<!--       <div class="coin_details_head i_cap">
        Капитализация
      </div> -->
      <div class="coin_details_head">
        Цена
      </div>
<!--       <div class="coin_details_head i_volume">
        Объем(24ч)
      </div> -->
<!--       <div class="coin_details_head i_sup">
        Оборот
      </div> -->
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
        :to="coinPath(coin)" 
        class="currency coin_row"
      >
        <div class="coin_details_item i_symbol" >
          {{ coin.attributes.symbol }} 
          <span class="button_icon ic_star" v-bind:class="activeFavourite( coin.attributes.symbol )"></span>
        </div>
        <div class="coin_details_item i_price">
          ${{ formatPrice(coin.attributes.price_usd) }}
        </div>
        <div class="coin_details_item change" v-bind:class="{ negative: (coin.attributes.percent_change24h < 0) }">
          {{ coin.attributes.percent_change24h }}%
        </div>
      </nuxt-link>
    </div>
  </div>
</template>

<script>

  import { coinsMixin } from './mixins/coins.js'

  export default {
    name: 'coins-list',
    data() {
      return {
        tooltip: null,
        topOfTooltip: 0,
        showTooltip: false,
      }
    },

    mixins: [coinsMixin],

    computed: {



    },

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
    }
  }

  function getCoinRow( element, deep = 3 ) {
    if ( element.className.indexOf('coin_row') > 0 ) {
      return element
    }

    let parentElement = element.parentElement
    if ( parentElement.className.indexOf('coin_row') > 0 ) {
      return parentElement
    }

    if ( deep-- <= 0 ) {
      return null
    } 
    getCoinRow( parentElement, deep )

  }
</script>