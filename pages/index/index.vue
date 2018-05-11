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


  const CURRENTFIELDS = {
      'TYPE'            : 0x0       // hex for binary 0, it is a special case of fields that are always there
    , 'MARKET'          : 0x0       // hex for binary 0, it is a special case of fields that are always there
    , 'FROMSYMBOL'      : 0x0       // hex for binary 0, it is a special case of fields that are always there
    , 'TOSYMBOL'        : 0x0       // hex for binary 0, it is a special case of fields that are always there
    , 'FLAGS'           : 0x0       // hex for binary 0, it is a special case of fields that are always there
    , 'PRICE'           : 0x1       // hex for binary 1
    , 'BID'             : 0x2       // hex for binary 10
    , 'OFFER'           : 0x4       // hex for binary 100
    , 'LASTUPDATE'      : 0x8       // hex for binary 1000
    , 'AVG'             : 0x10      // hex for binary 10000
    , 'LASTVOLUME'      : 0x20      // hex for binary 100000
    , 'LASTVOLUMETO'    : 0x40      // hex for binary 1000000
    , 'LASTTRADEID'     : 0x80      // hex for binary 10000000
    , 'VOLUMEHOUR'      : 0x100     // hex for binary 100000000
    , 'VOLUMEHOURTO'    : 0x200     // hex for binary 1000000000
    , 'VOLUME24HOUR'    : 0x400     // hex for binary 10000000000
    , 'VOLUME24HOURTO'  : 0x800     // hex for binary 100000000000
    , 'OPENHOUR'        : 0x1000    // hex for binary 1000000000000
    , 'HIGHHOUR'        : 0x2000    // hex for binary 10000000000000
    , 'LOWHOUR'         : 0x4000    // hex for binary 100000000000000
    , 'OPEN24HOUR'      : 0x8000    // hex for binary 1000000000000000
    , 'HIGH24HOUR'      : 0x10000   // hex for binary 10000000000000000
    , 'LOW24HOUR'       : 0x20000   // hex for binary 100000000000000000
    , 'LASTMARKET'      : 0x40000   // hex for binary 1000000000000000000, this is a special case and will only appear on CCCAGG messages
  };

  export default {
    transition: 'page',
    head() {
      return {
        title: this.headTitle
      }
    },
    data() {
      return {
        enabled: true,
        showLine: false,
        headTitle: 'ff.ru - курс биткоина, новости и прогнозы биткоина',

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
          xAxes: [{
            display: false,
            ticks: {
              callback: function(dataLabel, index) {
                // Hide the label of every 2nd dataset. return null to hide the grid line too
                return  '';
              }
            }
          }],
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
      },
      dataUnpack(message) {
        var data = this.unpack(message);
        if(!data['PRICE']) {
          return;
        }
        if(!data['OPEN24HOUR']) {
          return;
        }
        var delta = ((data['PRICE'] - data['OPEN24HOUR']) / data['OPEN24HOUR'] * 100).toFixed(2);
        return {price: data['PRICE'], delta: delta};
      },
      unpack(value) {
        var valuesArray = value.split("~");
        var valuesArrayLenght = valuesArray.length;
        var mask = valuesArray[valuesArrayLenght-1];
        var maskInt = parseInt(mask,16);
        var unpackedCurrent = {};
        var currentField = 0;
        for(var property in CURRENTFIELDS) {
          if(CURRENTFIELDS[property] === 0) {
            unpackedCurrent[property] = valuesArray[currentField];
            currentField++;
          }  else if(maskInt&CURRENTFIELDS[property]){
            if(property === 'LASTMARKET'){
              unpackedCurrent[property] = valuesArray[currentField];
            }else{
              unpackedCurrent[property] = parseFloat(valuesArray[currentField]);
            }
            currentField++;
          }
        }
        
        return unpackedCurrent;
      }
    },

    socket: {
      events: {
        m(msg) {
          var change = this.dataUnpack(msg);
          if(change) {
            this.headTitle = change.price + " BTC/USD Курс биткоина";
            this.price = change.price;
            this.percent_change_24h = change.delta;
          }
        },
        connect() {
          console.log('connect');
          this.$socket.emit('SubAdd', { subs: ['5~CCCAGG~BTC~USD'] });
        },
        disconnect() {
          console.log("Websocket disconnected from " + this.$socket.nsp);
        },
        error(err) {
          console.error("Websocket error!", err);
        }

      }
    }
  }


</script>