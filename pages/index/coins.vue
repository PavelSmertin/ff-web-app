<template>
  <section class="ff-coin-index">
      
    <div v-for="coin of $store.state.coins" v-bind:key="coin.id" class="currency ff-label">
      <nuxt-link :to="{ name: 'index-symbol',  params: { symbol: downSymbol(coin.attributes.symbol) }}" >
        {{ coin.attributes.symbol }}
      </nuxt-link>
      <div class="coin_details_item">
        {{ coin.attributes.market_cap_usd }}
      </div>
      <div class="coin_details_item">
        {{ coin.attributes.price_usd }}
      </div>
      <div class="coin_details_item">
        {{ coin.attributes.volume24h_usd }}
      </div>
      <div class="coin_details_item">
        {{ coin.attributes.available_supply }} {{ coin.attributes.symbol }}
      </div>
      <div class="coin_details_item">
        {{ coin.attributes.percent_change24h }}
      </div>

      <nuxt-link :to="{ name: 'index-symbol',  params: { symbol: downSymbol(coin.attributes.symbol) }}" class="click-area">
      </nuxt-link>
    </div>


  </section>
</template>



<script>
  import Vue from 'vue'
  import axios from 'axios'

  export default {
    transition: 'page',

    head() {
      return {
        title: this.headTitle,
        meta: [
          { 
            hid: 'description', 
            name: 'description', 
            content: this.headDescription,
          },
          { hid: 'og:type', property: 'og:type', content: 'website' },
          { hid: 'og:url', property: 'og:url', content: process.env.baseUrl },
          { hid: 'og:image', property: 'og:image', content: process.env.baseUrl + '/FF_cover1080_b.png' },
          { hid: 'twitter:image', name: 'twitter:image', content: process.env.baseUrl + '/FF_cover1080_b.png' },

          { hid: 'og:title', property: 'og:title', content: 'Рыночная капитализация криптовалют - FF.ru' },
          { hid: 'og:description', property: 'og:description', content: 'Рыночная капитализация криптовалют, рейтинг криптовалют, графики курса криптовалют в реальном времени, объемы рынка.' },
          { hid: 'twitter:title', name: 'twitter:title', content: 'Рыночная капитализация криптовалют - FF.ru' },
          { hid: 'twitter:description', name: 'twitter:description', content: 'Рыночная капитализация криптовалют, рейтинг криптовалют, графики курса криптовалют в реальном времени, объемы рынка.' },
        ],
      }
    },
    data() {
      return {
        enabled: true,
        headTitle: 'Рыночная капитализация криптовалют - FF.ru',
        headDescription: 'Рыночная капитализация криптовалют, рейтинг криптовалют, графики курса криптовалют в реальном времени, объемы рынка.',
      }
    },

    async asyncData ({ app }) {
    },

    methods: {
      formatPrice(value) {
        let val = (value/1).toFixed(2).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
      },
      downSymbol(value) {
        return value.toLowerCase()
      },

    },

  }


</script>