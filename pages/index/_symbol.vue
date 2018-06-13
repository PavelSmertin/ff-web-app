<template>
  <section class="ff-coin">
      
    <div class="row no-gutters">
      <h1 class="col-12 col-md-6">Курс {{ upSymbol() }}</h1>
      <div class="col-12 col-md-6">
        <div>
          <span class="coin-value">${{formatPrice(price_usd)}}</span>&nbsp;
          <span class="coin-unit">USD</span>&nbsp;
          <span class="coin-value positive">{{percent_change24h}}%</span>
        </div>
        <div>
          <span class="coin-info">{{price_btc}} BTC</span>&nbsp;
          <span class="coin-info positive">0,0%</span>
        </div>
      </div>
    </div>

    <div class="row no-gutters coin-details-block">
      <div class="coin_detail_unit col-6 col-md-3">
        <div class="ff-label">Капитализация</div>
        <div class="coin-detail">{{formatPrice(market_cap_usd)}} USD</div>
        <div class="coin-detail-info">{{formatPrice(total_coin_supply)}} BTC</div>
      </div>

      <div class="coin_detail_unit col-6 col-md-3">
        <div class="ff-label">Объем (24ч)</div>
        <div class="coin-detail">{{formatPrice(volume24_usd)}} USD</div>
        <div class="coin-detail-info">{{formatPrice(volume_24h_btc)}} BTC</div>
      </div>

      <div class="coin_detail_unit col-6 col-md-3">
        <div class="ff-label">В обороте</div>
        <div class="coin-detail">{{formatPrice(available_supply)}} BTC</div>
      </div>

      <div class="coin_detail_unit col-6 col-md-3">
        <div class="ff-label">В обороте (max)</div>
        <div class="coin-detail">{{formatPrice(max_supply)}} BTC</div>
      </div>
    </div>


  </section>
</template>


<script>
  import Vue from 'vue'
  import moment from 'moment'
  import axios from 'axios'

  export default {
    transition: 'page',
    head() {
      return {
        title: this.headTitle,
        symbol: false,
        meta: [
          { hid: 'og:type', property: 'og:type', content: 'website' },
          { hid: 'og:url', property: 'og:url', content: process.env.baseUrl },
          { hid: 'og:image', property: 'og:image', content: process.env.baseUrl + '/FF_cover1080_b.png' },
          { hid: 'twitter:image', name: 'twitter:image', content: process.env.baseUrl + '/FF_cover1080_b.png' },

          { hid: 'og:title', property: 'og:title', content: `Курс ${this.upSymbol()}, новости и прогнозы Биткоина в реальном времени на FF.ru` },
          { hid: 'og:description', property: 'og:description', content: `Курс, новости, прогнозы ${this.upSymbol()} и криптовалют в реальном времени.` },
          { hid: 'twitter:title', name: 'twitter:title', content: `Курс ${this.upSymbol()}, новости и прогнозы ${this.upSymbol()} в реальном времени на FF.ru` },
          { hid: 'twitter:description', name: 'twitter:description', content: `Курс, новости, прогнозы ${this.upSymbol()} и криптовалют в реальном времени.` },
        ],
      }
    },
    fetch( {params} ) {
      if (process.browser) {
        console.log('fetch')
        this.showLine = true // showLine will only be set to true on the client. This keeps the DOM-tree in sync.
        var script = document.createElement('script');
        script.src = "https://s3.tradingview.com/tv.js"
        document.body.appendChild(script);

        var chimpPopup = document.createElement("script");
        chimpPopup.appendChild(document.createTextNode('new TradingView.widget({"autosize": true,"symbol": "BITFINEX:' + params.symbol + 'USD","interval": "D","timezone": "Etc/UTC","theme": "Light","style": "0","locale": "ru","toolbar_bg": "#f1f3f6","enable_publishing": false,"container_id": "tradingview_53a94"});'));

        script.onload = function() {
          document.body.appendChild(chimpPopup);
        }
      }
    },

    data() {
      console.log('data')
      return {
        enabled: true,
        showLine: false,
      }
    },
    mounted () {
              console.log('mounted')

      // this.showLine = true // showLine will only be set to true on the client. This keeps the DOM-tree in sync.
      // var script = document.createElement('script');
      // script.src = "https://s3.tradingview.com/tv.js"
      // document.body.appendChild(script);

      // var chimpPopup = document.createElement("script");
      // chimpPopup.appendChild(document.createTextNode('new TradingView.widget({"autosize": true,"symbol": "BITFINEX:' + this.symbol + 'USD","interval": "D","timezone": "Etc/UTC","theme": "Light","style": "0","locale": "ru","toolbar_bg": "#f1f3f6","enable_publishing": false,"container_id": "tradingview_53a94"});'));

      // script.onload = function() {
      //   document.body.appendChild(chimpPopup);
      // }
    },

    async asyncData ({ app, params }) {

        console.log('asyncData')

      const details = await app.$axios.get(`/api/coin/full-list?per-page=2000&filters[portfolio-coins][symbol]=${upSymbol(params.symbol)}`)

      if(details.data.data.length == 0) {
        return { 
          total_coin_supply:  0,
          available_supply:   0,
          max_supply:         0,
          price_usd:          0,
          price_btc:          0,
          percent_change24h:  0,
          volume24_usd:       0,
          market_cap_usd:     0,
          volume_24h_btc:     0,
          symbol: upSymbol(params.symbol),
          headTitle: `(${upSymbol(params.symbol)}/USD) - Курсы криптовалют в реальном времени на FF.ru`,
        }
      }

      const { 
        total_coin_supply, 
        available_supply, 
        max_supply, 
        price_usd, 
        price_btc,
        percent_change24h, 
        volume24_usd, 
        market_cap_usd,
        volume_24h_btc
      }  = details.data.data[0].attributes

      return { 
        total_coin_supply,
        available_supply,
        max_supply,
        price_usd,
        price_btc,
        percent_change24h,
        volume24_usd: 0,
        market_cap_usd,
        volume_24h_btc: 0,
        symbol: upSymbol(params.symbol),
        headTitle: `(${upSymbol(params.symbol)}/USD) - Курсы криптовалют в реальном времени на FF.ru`,
      }
    },

    methods: {
      formatPrice(value) {
        let val = (value/1).toFixed(2).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
      },
      upSymbol() {
        return this.symbol ? this.symbol.toUpperCase() : ''
      }
    }
  }


  function upSymbol(value) {
    return value.toUpperCase()
  }


</script>