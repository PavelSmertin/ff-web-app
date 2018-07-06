<template>
  <div class="ff_coin_index">
    <div class="coin_header">
      <div class="coin_details_head i_symbol"></div>
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

    <nuxt-link 
        v-for="coin of $store.state.coins" 
        v-bind:key="coin.id" 
        :to="coinPath(coin)" 
        class="currency coin_row"
      >
      <div class="coin_details_item i_symbol" >
        {{ coin.attributes.symbol }} 
      </div>
<!--       <div class="coin_details_item i_cap">
        ${{ formatPrice(coin.attributes.market_cap_usd) }}
      </div> -->
      <div class="coin_details_item i_price">
        ${{ formatPrice(coin.attributes.price_usd) }}
      </div>
<!--       <div class="coin_details_item i_volume">
        ${{ formatPrice(coin.attributes.volume24h_usd) }}
      </div> -->
<!--       <div class="coin_details_item i_sup">
        {{ formatPrice(coin.attributes.available_supply) }} {{ coin.attributes.symbol }}
      </div> -->
      <div class="coin_details_item change" v-bind:class="{ negative: (coin.attributes.percent_change24h < 0) }">
        {{ coin.attributes.percent_change24h }}%
      </div>
    </nuxt-link>
  </div>
</template>

<script>

  export default {
    name: 'coins-list',
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
    }
  }
</script>