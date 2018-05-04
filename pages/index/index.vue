<template>
  <div class="ff-coin">
    <a href="" class="pane-close-mobile pane-close">
      <span class="icon icon-times"></span>
    </a> 

    <div>
      
      <div class="row no-gutters">
        <h1 class="col">Курс биткойна</h1>
        <div class="col">
          <div>
            <span class="coin-value">${{price}}</span>&nbsp;
            <span class="coin-unit">USD</span>&nbsp;
            <span class="coin-value positive">{{percent_change_24h}}%</span>
          </div>
          <div>
            <span class="coin-info">1,00000000 BTC</span>&nbsp;
            <span class="coin-info positive">0,0%</span>
          </div>
        </div>
      </div>


      <div class="row no-gutters coin-details-block">
        <div class="col">
          <div class="ff-label">Капитализация</div>
          <div class="coin-detail">{{market_cap}} USD</div>
          <div class="coin-detail-info">1{{total_supply}} BTC</div>
        </div>

        <div class="col">
          <div class="ff-label">Объем (24ч)</div>
          <div class="coin-detail">{{volume_24h}} USD</div>
          <div class="coin-detail-info">{{volume_24h_btc}} BTC</div>
        </div>

        <div class="col">
          <div class="ff-label">В обороте</div>
          <div class="coin-detail">{{circulating_supply}} BTC</div>
        </div>

        <div class="col">
          <div class="ff-label">В обороте (max)</div>
          <div class="coin-detail">{{max_supply}} BTC</div>
        </div>
      </div>


      <coin-line v-if="showLine" :data="lineData" :options="options" :width="817" :height="350" class="margin40"></coin-line>




<!--       <p class="social">
        <a href="https://vk.com/cryptoff" class="colored-link" target="_blank">ВК</a>
        <br />
        <a href="https://t.me/ff_ru" class="colored-link" target="_blank">Телеграм</a>
        <br />
        <a href="https://twitter.com/FFru11" class="colored-link" target="_blank">Твиттер</a>
        <br />
        <a href="https://fb.com/crypto.ff.ru/" class="colored-link" target="_blank">Facebook</a>
      </p>
 -->

    </div>
  </div>
</template>



<script>
  import Vue from 'vue'
  import axios from 'axios'

  let ToggleButton
  if (process.browser) {
    ToggleButton = require('vue-js-toggle-button')
  }

  export default {
    transition: 'page',
    head: {
      title: 'ff - новостной портал, предоставляющий самую актуальную информацию, влияющую на стоимость криптовалют'
    },
    data() {
      return {
        enabled: true,
        showLine: false
      }
    },
    mounted () {
      this.showLine = true // showLine will only be set to true on the client. This keeps the DOM-tree in sync.
    },  
    async asyncData () {

      const dataLimit = 720
      const options = {
        responsive: true, 
        maintainAspectRatio: true,
        devicePixelRatio: 1,
        elements: {
            point: { radius: 0 },
            line: { tension: 0 }
        },
        legend: { display: false },
        scales: {
          yAxes: [{
            position: 'right',
            ticks: { beginAtZero:false }
          }]
        }
      }

      try {

        const { data } = await axios.get(`https://min-api.cryptocompare.com/data/histohour?fsym=BTC&tsym=USD&limit=${+dataLimit}&aggregate=3&e=CCCAGG`)
   
        const labels = data.Data.map(a => a.time)
        const values = data.Data.map(a => a.close)

        const lineData = {
          labels: labels,
          datasets: [{
              label: '$',
              data: values,
              backgroundColor: ['rgba(255, 255, 255, 0.7)'],
              borderColor: ['rgba(255, 153, 0, 1)'],
              borderWidth: 2
          }]
        }





        const details = await axios.get(`https://api.coinmarketcap.com/v2/ticker/1/?convert=BTC`)


        const { total_supply, circulating_supply, max_supply }  = details.data.data

        const { price, percent_change_24h, volume_24h, market_cap } = details.data.data.quotes.USD
        const volume_24h_btc = details.data.data.quotes.BTC.volume_24h

        return { 
                  lineData, 
                  options, 
                  total_supply, 
                  circulating_supply, 
                  max_supply, 
                  price, 
                  percent_change_24h, 
                  volume_24h, 
                  market_cap, 
                  volume_24h_btc 
                }

      } catch (e) {
        console.log('lineData error')
      }
    },
    methods: {
      formatPrice(value) {
        let val = (value/1).toFixed(2).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      }
    }
  }

</script>