<template>
  <section class="ff-coin">
      
    <div class="row no-gutters">
      <h1 class="col-12 col-md-6">Курс {{ getCase() }}</h1>
      <div class="col-12 col-md-6">
        <div>
          <span class="coin-value">${{formatPrice(attributes.price_usd)}}</span>&nbsp;
          <span class="coin-unit">USD</span>&nbsp;
          <span class="coin-value positive">{{attributes.percent_change24h}}%</span>
        </div>
        <div>
          <span class="coin-info">{{attributes.price_btc}} BTC</span>&nbsp;
          <span class="coin-info positive">0,0%</span>
        </div>
      </div>
    </div>

    <div class="row no-gutters coin-details-block">
      <div class="coin_detail_unit col-6 col-md-3">
        <div class="ff-label">Капитализация</div>
        <div class="coin-detail">{{formatPrice(attributes.market_cap_usd)}} USD</div>
        <div class="coin-detail-info">{{formatPrice(attributes.total_coin_supply)}} BTC</div>
      </div>

      <div class="coin_detail_unit col-6 col-md-3">
        <div class="ff-label">Объем (24ч)</div>
        <div class="coin-detail">{{formatPrice(attributes.volume24h_usd)}} USD</div>
        <div class="coin-detail-info">{{formatPrice(attributes.volume24h_btc)}} BTC</div>
      </div>

      <div class="coin_detail_unit col-6 col-md-3">
        <div class="ff-label">В обороте</div>
        <div class="coin-detail">{{formatPrice(attributes.available_supply)}} BTC</div>
      </div>

      <div class="coin_detail_unit col-6 col-md-3">
        <div class="ff-label">В обороте (max)</div>
        <div class="coin-detail">{{formatPrice(attributes.max_supply)}} BTC</div>
      </div>
    </div>

    <vue-highcharts :options="options" ref="lineCharts" :callback="callback()"></vue-highcharts>

    <section v-if="attributes.seo_text" class="ff_text_block margin60" v-html="attributes.seo_text"></section>

  </section>
</template>


<script>
  import Vue from 'vue'
  import moment from 'moment'
  import axios from 'axios'
  import VueHighcharts from '~/components/VueHighcharts.vue'
  import { DrilldownOptions, MapData } from '~/static/data.js'

  export default {
    transition: 'page',
    head() {
      return {
        title: this.headTitle,
        symbol: false,
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
        enabled: true,
        showLine: false,
        options: DrilldownOptions,
        series: {
          type: 'area',
          zIndex: 50
        }
      }
    },

    async asyncData ({ app, params, error }) {

      const details = await app.$axios.get(process.env.apiUrl + `/v1/coin/full-list?per-page=2000&filters[portfolio-coins][symbol]=${upSymbol(params.symbol)}`)

      if(!details.data.data || details.data.data.length == 0) {
        error ({ message: 'Такой монеты не существует', statusCode: 404 })
        return
      }

      const { attributes }  = details.data.data[0] 
      let headTitle        = getTitle(attributes)
      let headDescription  = getDescription(attributes)

      console.log(attributes)

      return { attributes, headTitle, headDescription }
    },

    components: {
      VueHighcharts
    },

    mounted () {
      this.loadChart(this.attributes.symbol)
    },

    methods: {
      formatPrice(value) {
        let val = (value/1).toFixed(2).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
      },
      upSymbol() {
        return this.symbol ? this.symbol.toUpperCase() : ''
      },
      loadChart(symbol) {

        console.log('loadChart: ' + symbol)
        let lineCharts = this.$refs.lineCharts
        lineCharts.delegateMethod('showLoading', 'Loading...')

        axios.get(`https://min-api.cryptocompare.com/data/histohour?fsym=` + upSymbol(symbol) + `&tsym=USD&limit=720&aggregate=3&e=CCCAGG`)
        .then((data) => {
          this.series.data = data.data.Data.map(a => [a.time*1000, a.close] )
          lineCharts.removeSeries()
          lineCharts.addSeries(this.series)
          lineCharts.hideLoading()
        })
        .catch(e => {
          lineCharts.hideLoading();
        })
      },
      getImageSharing() {
        return '/FF_cover1080_b.png'
      },
      getCase(value) {
        return getCase(this.attributes, 2)
      },
      callback() {
        return function() {
          console.log('callback')
        }
      },
    },

    beforeRouteUpdate (to, from, next) {
      if(to.name == "index-symbol") {
        this.loadChart(to.params.symbol)
      }
      next();
    },
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
    return `(${params.symbol}/USD) Курс ${params.coin_name} к доллару, (${params.symbol}/RUB) курс ${getCase(params, 2)} к рублю - прогноз на сегодня - FF.ru`
  }

  function getDescription (params) {
    if( params.meta_description ) {
      return params.meta_description
    }
    return `Актуальный курс ${params.full_name} к доллару. График курса ${getCase(params, 2)} на сегодня, новости, прогноз цены ${params.coin_name}. Когда купить ${getCase(params, 1)} - поможем принять решение.`
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