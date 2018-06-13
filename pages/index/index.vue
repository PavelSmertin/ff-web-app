<template>
  <section class="ff-coin">
      
    <div class="row no-gutters">
      <h1 class="col-12 col-md-6">Курс биткоина</h1>
      <div class="col-12 col-md-6">
        <div>
          <span class="coin-value">${{formatPrice(price)}}</span>&nbsp;
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
      <div class="coin_detail_unit col-6 col-md-3">
        <div class="ff-label">Капитализация</div>
        <div class="coin-detail">{{formatPrice(market_cap)}} USD</div>
        <div class="coin-detail-info">{{formatPrice(total_supply)}} BTC</div>
      </div>

      <div class="coin_detail_unit col-6 col-md-3">
        <div class="ff-label">Объем (24ч)</div>
        <div class="coin-detail">{{formatPrice(volume_24h)}} USD</div>
        <div class="coin-detail-info">{{formatPrice(volume_24h_btc)}} BTC</div>
      </div>

      <div class="coin_detail_unit col-6 col-md-3">
        <div class="ff-label">В обороте</div>
        <div class="coin-detail">{{formatPrice(circulating_supply)}} BTC</div>
      </div>

      <div class="coin_detail_unit col-6 col-md-3">
        <div class="ff-label">В обороте (max)</div>
        <div class="coin-detail">{{formatPrice(max_supply)}} BTC</div>
      </div>
    </div>

    <no-ssr>
      <highcharts :constructor-type="'stockChart'" :options="testOptions" ref="lineCharts"></highcharts>
    </no-ssr>
    <no-ssr>
      <button @click="loadChart">load</button>
    </no-ssr>


    <section class="ff_text_block">
      <h2 class="margin60">Онлайн график курса биткоина к доллару. Прогноз цены Bitcoin</h2>

      <p class="margin20">Биткоин (Bitcoin) - первая в мире криптовалюта и система P2P платежей. В 2008 году некто под псевдонимом Сатоши Накамото описал пиринговую сеть платежей, которую назвал Bitcoin (BTC). Суть системы заключается в децентрализации, анонимности и шифровании, что в свою очередь говорит о надежности системы. Транзакции в сети «Биткоин» обрабатываются без участия третьей стороны - их невозможно изменить, отменить или заблокировать.</p>
      <p>Чтобы начать пользоваться преимуществами криптовалюты, достаточно установить любой биткоин кошелек, получить монеты BTC от другого участника сети или купить их по текущему курсу на бирже или в обменнике.</p>
      <p>Курс биткоина к доллару неуклонно растет:</p>
      <ul>
        <li>Июнь 2010: $0.003</li>
        <li>Июнь 2011: $1</li>
        <li>Июнь 2012: $5</li>
        <li>Июнь 2013: $80</li>
        <li>Июнь 2014: $600</li>
        <li>Июнь 2015: $250</li>
        <li>Июнь 2016: $400</li>
        <li>Июнь 2017: $950</li>
        <li>Июнь 2018: ~$8500</li>
      </ul>
      <p>В декабре 2017 курс достигал 20 000 долларов за 1 BTC.</p>
      <p>Сегодня текущий курс биткоина к доллару и рублю можно узнать онлайн на сайте FF.ru. Историю изменений курса удобно отслеживать на графике. На сайте собраны последние новости из мира криптовалют и прогнозы по цене биткоина на основании технического анализа и новостей.</p>

      <p>Эксперты прогнозируют, что курс биткоина в 2018 году составит от 30 000 до 100 000 долларов. Наиболее вероятно, что такой прогноз по цене Bitcoin (BTC) будет актуален в перспективе 2-3 лет.</p>

      <p>Для держателей монет Bitcoin важно не упустить момент роста цены криптовалюты. Подпишитесь на уведомления об изменении курса и актуальные прогнозы, чтобы быть в курсе изменения цен на биткоин.</p>
    </section>

  </section>
</template>



<script>
  import Vue from 'vue'
  import moment from 'moment'
  import axios from 'axios'


  import Highcharts from 'highcharts'
  import StockInit from 'highcharts/modules/stock.src'
  import { DrilldownOptions, MapData} from '~/static/data.js'

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
        title: this.headTitle,
        meta: [
          { hid: 'og:type', property: 'og:type', content: 'website' },
          { hid: 'og:url', property: 'og:url', content: process.env.baseUrl },
          { hid: 'og:image', property: 'og:image', content: process.env.baseUrl + '/FF_cover1080_b.png' },
          { hid: 'twitter:image', name: 'twitter:image', content: process.env.baseUrl + '/FF_cover1080_b.png' },

          { hid: 'og:title', property: 'og:title', content: 'Курс Bitcoin (BTC), новости и прогнозы Биткоина в реальном времени на FF.ru' },
          { hid: 'og:description', property: 'og:description', content: 'Курс, новости, прогнозы Bitcoin (BTC) и криптовалют в реальном времени. Когда покупать Биткоин - поможем принять решение. Подпишись на новости и не упусти момент, когда цены начнут меняться.' },
          { hid: 'twitter:title', name: 'twitter:title', content: 'Курс Биткоина, новости и прогнозы Биткоина в реальном времени на FF.ru' },
          { hid: 'twitter:description', name: 'twitter:description', content: 'Курс, новости, прогнозы Bitcoin (BTC) и криптовалют в реальном времени. Когда покупать Биткоин - поможем принять решение. Подпишись на новости и не упусти момент, когда цены начнут меняться.' },
        ],
      }
    },
    data() {
      return {
        enabled: true,
        showLine: false,
        headTitle: '(BTC/USD) Курс Bitcoin к доллару, (BTC/RUB) курс Биткоина в рублях - Курсы криптовалют в реальном времени на FF.ru',
        
        //testOptions: DrilldownOptions,
        testOptions: {
          rangeSelector: {
            selected: 1
          },
          title: {
            text: 'AAPL Stock Price'
          },
          series: [{
            name: 'AAPL',
            data: [10, 20, 10, 23, 65, 121, 44, 66, 98, 30, 32, 56, 25, 12, 53],
            pointStart: Date.UTC(2018, 1, 1),
            pointInterval: 1000 * 3600 * 24,
            tooltip: {
              valueDecimals: 2
            }
          }]
        },
        series: {
          name: 'COIN',
          type: 'area',
          data: [],
          gapSize: 5,
          tooltip: {
              valueDecimals: 2
          },
          threshold: null
        }
      }
    },
    mounted () {
      this.showLine = true // showLine will only be set to true on the client. This keeps the DOM-tree in sync.
      StockInit(Highcharts)
      //this.loadChart()

    },

    created () {

        // var script = document.createElement('script');
        // script.src = "https://s3.tradingview.com/tv.js"
        // document.body.appendChild(script);

        // var chimpPopup = document.createElement("script");
        // chimpPopup.appendChild(document.createTextNode('new TradingView.widget({"autosize": true,"symbol": "BINANCE:BTCUSD","interval": "D","timezone": "Etc/UTC","theme": "Light","style": "0","locale": "ru","toolbar_bg": "#f1f3f6","enable_publishing": false,"container_id": "tradingview_53a94"});'));

        // script.onload = function() {
        //   document.body.appendChild(chimpPopup);
        // }
    },

    async asyncData ({ app }) {

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
            ticks: { 
              beginAtZero:false
            }
          }]
        }
      }

      try {

        // const { data } = await axios.get(`https://min-api.cryptocompare.com/data/histohour?fsym=BTC&tsym=USD&limit=${+dataLimit}&aggregate=3&e=CCCAGG`)
   
        // const labels = data.Data.map(a => a.time)
        // const values = data.Data.map(a => a.close)

        // const lineData = {
        //   labels: labels,
        //   datasets: [{
        //       label: '$',
        //       data: values,
        //       backgroundColor: ['rgba(255, 255, 255, 0.7)'],
        //       borderColor: ['rgba(255, 153, 0, 1)'],
        //       borderWidth: 2
        //   }]
        // }


        const details = await axios.get(`https://api.coinmarketcap.com/v2/ticker/1/?convert=BTC`)

        const { total_supply, circulating_supply, max_supply }  = details.data.data

        const { price, percent_change_24h, volume_24h, market_cap } = details.data.data.quotes.USD
        const volume_24h_btc = details.data.data.quotes.BTC.volume_24h

        return { 
                  lineData: {}, 
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
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
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
      },

      loadChart() {
        let lineCharts = this.$refs.lineCharts;
        lineCharts.delegateMethod('showLoading', 'Loading...');

        axios.get(`https://min-api.cryptocompare.com/data/histohour?fsym=BTC&tsym=USD&limit=720&aggregate=3&e=CCCAGG`)
        .then((data) => {
          this.series.data = data.data.Data.map(a => [a.time*1000, a.close] )
          console.log(this.series)

          lineCharts.addSeries(this.series)
          lineCharts.hideLoading()
        })
        .catch(e => {
          lineCharts.hideLoading();
        })
      }
    },

    socket: {
      events: {
        m(msg) {
          var change = this.dataUnpack(msg);
          var now = moment();
          var today = now.format('DD.MM.YYYY');

          if(change) {
            this.headTitle = change.price + " (BTC/USD) Курс Bitcoin к доллару " + today + " - Курсы криптовалют в реальном времени на FF.ru";
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