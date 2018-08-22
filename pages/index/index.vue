<template>
  <section class="ff_coin">
      
    <div class="row no-gutters margin24">
      <div class="col-12 col-md-6 coin_title" v-on:click="watch()">
        <span class="button_icon ic_star" v-bind:class="activeFavourite"></span>
        <h1>Курс {{ getBTCCase() }}</h1>
      </div>
      <div class="col-12 col-md-6">
        <div>
          <transition name="slide-fade" mode="out-in">
            <span 
              :key="price()" 
              class="coin-value"
              v-bind:class="isUp( attributes )"
            >
              ${{ price() }}
            </span>
          </transition>
          &nbsp;


          <span class="coin-unit">USD</span>&nbsp;
          <span class="coin-value positive" v-bind:class="{ negative: (attributes.percent_change24h < 0) }">
            {{attributes.percent_change24h}}%
          </span>
        </div>
        <div>
          <span class="coin-info">{{ formatPrice(attributes.price_rub) }} RUB</span>&nbsp;
        </div>
      </div>
    </div>

    <div class="row no-gutters coin-details-block">

        <div class="coin_detail_unit col-6 col-md-3">
          <div class="ff-label">Капитализация</div>
          <div class="coin-detail">{{ formatPrice(attributes.market_cap_usd, 0) }} USD</div>
          <div class="coin-detail-info">{{ formatPrice(attributes.total_coin_supply, 0) }} {{attributes.symbol }}</div>
        </div>

        <div class="coin_detail_unit col-6 col-md-3">
          <div class="ff-label">Объем торгов (24ч)</div>
          <div class="coin-detail">{{ formatPrice(attributes.volume24h_usd, 0) }} USD</div>
          <div class="coin-detail-info">{{ formatPrice(attributes.volume24h_btc, 0) }} {{ attributes.symbol }}</div>
        </div>

        <div class="coin_detail_unit col-6 col-md-2">
          <div class="ff-label">Изменение (1ч)</div>
          <div class="coin-detail positive" v-bind:class="{ negative: (attributes.change1h_usd < 0) }">
            {{ formatPrice(attributes.percent_change1h) }}%
          </div>
          <div class="coin-detail-info positive" v-bind:class="{ negative: (attributes.change1h_usd < 0) }">
            {{ formatPrice(attributes.change1h_usd) }} USD
          </div>
        </div>

        <div class="coin_detail_unit col-6 col-md-2">
          <div class="ff-label">Изменение (24ч)</div>
          <div class="coin-detail positive" v-bind:class="{ negative: (attributes.change24h_usd < 0) }">
            {{ formatPrice(attributes.percent_change24h) }}%
          </div>
          <div class="coin-detail-info positive" v-bind:class="{ negative: (attributes.change24h_usd < 0) }">
            {{ formatPrice(attributes.change24h_usd) }} USD
          </div>
        </div>

        <div class="coin_detail_unit col-6 col-md-2">
          <div class="ff-label">Изменение (7д)</div>
          <div class="coin-detail positive" v-bind:class="{ negative: (attributes.change7d_usd < 0) }">
            {{ formatPrice(attributes.percent_change7d) }}%
          </div>
          <div class="coin-detail-info positive" v-bind:class="{ negative: (attributes.change7d_usd < 0) }">
            {{ formatPrice(attributes.change7d_usd) }} USD
          </div>
        </div>

    </div>

    <div class="row no-gutters margin12">
      <h2>Биткойн калькулятор</h2>
    </div>
    <div class="row no-gutters calculator margin6">
      <div class="calculator_item">
        <div class="label"><img src="~/assets/images/btc_icon.png" width="20" height="20" alt="btc_icon"><span class="label_currency">BTC</span></div>
        <input type="text" name="btc" v-model="calculateBTC" autocomplete="off"  v-on:keypress="isNumber" @focus="$event.target.select()" @mouseup="calcSafaryHack" >
      </div>
      <div class="calculator_item">
        <div class="label"><img src="~/assets/images/usd_icon.svg" alt="usd_icon"><span class="label_currency">USD</span></div>
        <input type="text" name="usd" v-model="calculateUSD" autocomplete="off"  v-on:keypress="isNumber" @focus="$event.target.select()" @mouseup="calcSafaryHack">
      </div>
      <div class="calculator_item">
        <div class="label"><img src="~/assets/images/rub_icon.svg" alt="rub_icon"><span class="label_currency">RUB</span></div>
        <input type="text" name="rub" v-model="calculateRUB" autocomplete="off"  v-on:keypress="isNumber" @focus="$event.target.select()" @mouseup="calcSafaryHack">
      </div>
      <div class="calculator_item">
        <nuxt-link @click.native="sendEvent('BuyBTC', 'click')" :to="{path: '/wiki/1'}">
          <span class="apply">КУПИТЬ BTC</span>
          <img src="~/assets/images/baseline-arrow_forward-24px.svg" alt="arrow">
        </nuxt-link >
      </div>
    </div>

    <div class="row no-gutters border_top margin24">
      <h2 class="margin12">График курса Bitcoin к Доллару</h2>
    </div>
    <div class="row no-gutters">
      <div id="tradingview_53a94" class="tradingview" ref="tradingview"></div>
    </div>

    <div class="row no-gutters border_top margin24">
      <h2 class="margin12">Курс BTC/USD на биржах</h2>
    </div>

    <div class="row no-gutters margin6 pairs_row">
      <div class="ff_pairs_index">
        <div class="ff_pairs_header">
          <div class="ff_pairs_head">
            Биржа
          </div>
          <div class="ff_pairs_head i_price">
            Курс
          </div>
          <div class="ff_pairs_head i_high">
            Мин (24ч)
          </div>
          <div class="ff_pairs_head i_low">
            Макс (24ч)
          </div>
          <div class="ff_pairs_head changes">
            Изменения (24ч)
          </div>
          <div class="ff_pairs_head i_volume">
            Объем (BTC)
          </div>
        </div>

        <div class="ff_pair" v-for="pair of pairs" v-bind:key="pair.exchange_id" >

          <div class="ff_pair_item">{{ pair.exchange.name }}</div>
          <div class="ff_pair_item i_price">${{ formatPrice(pair.price) }}</div>
          <div class="ff_pair_item i_low">${{ formatPrice(pair.low24hour) }}</div>
          <div class="ff_pair_item i_high">${{ formatPrice(pair.high24hour) }}</div>
          <div class="ff_pair_item changes positive" v-bind:class="{ negative: (pair.changepct24hour < 0) }">
            {{ formatPrice(pair.changepct24hour) }}%
          </div>
          <div class="ff_pair_item i_volume">{{ formatPrice(pair.volume24hour, 0) }}</div>
        </div>
      </div>
    </div>

    <div class="row no-gutters border_top margin24">
      <h3 class="margin12">Руководство для начинающих</h3>
    </div>

    <div class="margin6">
      <div class="row no-gutters wiki_row">
        <nuxt-link @click.native="onWikiClick(1)" class="col-12 col-md-4 wiki_item" :to="{ path: '/wiki/1' }">
          <p class="wiki_title">Как купить биткоин?</p>
          <p class="wiki_description">Инструкция: как купить биткоин онлайн надежно с карты за рубли, доллары или через электронные кошельки QIWI, Webmoney</p>
        </nuxt-link>
        <nuxt-link @click.native="onWikiClick(2)" class="col-12 col-md-4 wiki_item" :to="{ path: '/wiki/2' }">
          <p class="wiki_title">Где хранить биткоины?</p>
          <p class="wiki_description">Важно выбрать наиболее надежный и удобный способ хранения биткоина, для этого подойдут Bitcoin кошельки. Существует несколько типов кошельков, разберемся какой лучше</p>
        </nuxt-link>        
        <nuxt-link @click.native="onWikiClick(3)" class="col-12 col-md-4 wiki_item" :to="{ path: '/wiki/3' }">
          <p class="wiki_title">Что такое блокчейн?</p>
          <p class="wiki_description">BlockChain (англ. Block – блок; Chain - цепь) - это база данных, которая ежедневно пополняется информацией о криптовалютных переводах между пользователями</p>
        </nuxt-link>
      </div>

      <div class="row no-gutters wiki_row">
        <nuxt-link @click.native="onWikiClick(4)"  class="col-12 col-md-4 wiki_item" :to="{ path: '/wiki/4' }">
          <p class="wiki_title">Как продать биткоин?</p>
          <p class="wiki_description">Продать или обналичить биткоины можно нескольким способами, например через биржи, обменники или с помощью карты</p>
        </nuxt-link>
        <nuxt-link @click.native="onWikiClick(5)" class="col-12 col-md-4 wiki_item" :to="{ path: '/wiki/5' }">
          <p class="wiki_title">Биткоин в России</p>
          <p class="wiki_description">Биткоин в России использовать можно, отношение государства к криптовалюте на данный момент носит неопределенный характер</p>
        </nuxt-link>
        <nuxt-link @click.native="onWikiClick(6)" class="col-12 col-md-4 wiki_item" :to="{ path: '/wiki/6' }">
          <p class="wiki_title">Что такое Биткоин?</p>
          <p class="wiki_description">Биткоин - первая криптовалюта, ставшая всемирно-известной в 2017 году. Основная суть биткоина состоит в децентрализации</p>
        </nuxt-link>
      </div>
    </div>

    <div class="row no-gutters border_top margin24">
      <h3 class="margin12 col-8">Лидеры криптовалют за 24 часа</h3>
      <div class="margin12 col-4 align-right">
          <nuxt-link class="h_link" :to="{ path: '/coins' }">Все монеты</nuxt-link>
      </div>
    </div>

    <div>
      <coins-list-other :otherCoins="otherCoins" />
    </div>

    <div class="row no-gutters border_top margin24">
      <h3 class="margin12">Быстрая статистика Биткоина</h3>
    </div>
    <div class="row no-gutters margin6">
      <dl class="coin_stat">
        <dt>Дата запуска</dt><dd>Январь 3, 2009</dd>
        <dt>Позиция в рейтинге MarketCap</dt><dd>№1</dd>
        <dt>ATH</dt><dd>$19 665.39</dd>
        <dt>С момента достижения ATH</dt><dd>-70%</dd>
        <dt>Дата ATH</dt><dd>16.12.2017</dd>
        <dt>Доступный объем</dt><dd>17.1 миллионов</dd>
        <dt>Общий объем</dt><dd>21.0 миллион</dd>
        <dt>Официальный сайт</dt><dd><a href="https://bitcoin.org/" rel="nofollow noopener" target="_blank">bitcoin.org</a></dd>
        <dt>Цепочка блоков / Выпущено</dt>
        <dd>
          <a href="https://blockchair.com/bitcoin/blocks" rel="nofollow noopener" target="_blank">blockchair.com</a><br>
          <a href="https://www.blockchain.com/en/explorer" rel="nofollow noopener" target="_blank">blockchain.com</a><br>
          <a href="https://live.blockcypher.com/btc/" rel="nofollow noopener">blockcypher.com</a>
        </dd>
        <dt>Форум</dt><dd><a href="https://bitcointalk.org/" rel="nofollow noopener" target="_blank">bitcointalk.org</a></dd>
        <dt>Алгоритм хеширования</dt><dd>SHA-256</dd>
        <dt>Скорость хеширования</dt><dd>577,744 PH/s</dd>
        <dt>Время между блоками</dt><dd>10 минут</dd>
      </dl>
    </div>


    <div class="row no-gutters border_top margin12">
      <section v-if="attributes.seo_text" class="row ff_text_block margin60" v-html="attributes.seo_text"></section>
    </div>

  </section>
</template>


<script>
  import Vue from 'vue'
  import axios from 'axios'
  import CoinsListOther from '~/components/CoinsListOther.vue'

  import Jsona from 'jsona';
  import { analMixin } from '~/components/mixins/analitics.js'

  const dataFormatter = new Jsona()

  export default {

    mixins: [ analMixin  ],

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
        series: {
          type: 'area',
          zIndex: 50
        }
      }
    },

    async asyncData ({ app, params, error }) {

      let details 
      let pairs
      let otherCoins
      try {
        let [ response_details, response_pairs, responseOtherCoins ] = await Promise.all([
            app.$axios.get(`/api/coin/full-list?per-page=2000&filters[portfolio-coins][symbol]=BTC`),
            app.$axios.get(`/api/exchanges/BTC/top?include=exchange&fields[portfolio-exchange]=name&fields[portfolio-exchange]=name&per-page=10`),
            app.$axios.get(`/api/coins/BTC/other?per-page=8`),
        ])

        details = dataFormatter.deserialize(response_details.data)
        pairs = dataFormatter.deserialize(response_pairs.data)
        otherCoins = responseOtherCoins.data.data

      } catch (e) {
        if( e.response && e.response.status == 404 ) {
          error ({ message: 'Такой монеты не существует', statusCode: 404 })
          return
        }
      }

      if(!details || details.length == 0) {
        error ({ message: 'Такой монеты не существует', statusCode: 404 })
        return
      }

      const attributes     = details[0] 
      let headTitle        = getTitle(attributes)
      let headDescription  = getDescription(attributes)

      return {
        attributes,
        headTitle,
        headDescription,
        pairs,
        otherCoins,
        calculatorBTC: 1,
        calculatorUSD: attributes.price_usd,
        calculatorRUB: attributes.price_rub,
      }
    },

    components: {
      CoinsListOther,
    },

    mounted () {
      this.goto()
      this.initTradingViewChart()
      this.watchSocketCoin()

    },

    methods: {
      goto() {
        var element = this.$parent.$refs["scroll-container"];
        element.scrollTo(0, 0);
      },
      
      formatPrice(value, percision = 2) {
        let val = (value/1).toFixed(percision)
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
      },
      getImageSharing() {
        return '/FF_cover968_b.png'
      },
      getBTCCase() {
        return this.attributes.symbol == 'BTC' ? getCase(this.attributes, 2) : this.attributes.coin_name
      },
      getCase(value) {
        return getCase(this.attributes, 2)
      },
      callback() {
        return function() {
        }
      },
      formatCalculator(value, percision = 2) {
        let val = (value/1).toFixed(percision)
        return val.toString()
      },
      isNumber: function(evt) {
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
          evt.preventDefault();;
        } else {
          return true;
        }
      },
      calcSafaryHack: function (event) {
        event.preventDefault();
      },
      onWikiClick: function ( wikiPage ) {
        this.sendEvent( 'BTCWiki', 'click', wikiPage );
      },
      watch() {
        this.sendEvent( 'CoinWatch', 'watch', 'BTC' );
        this.$axios.post(`/api/coin/favorite?include=favoritecoins`, `symbol=BTC`)
          .then(({ data }) => {
            let response = dataFormatter.deserialize( data )
            this.$store.commit('SET_FAVORITE_COINS', response.favoritecoins)
          }).catch(e => {
            if (e.response && e.response.status == 401) {
              this.$router.push({ name: `account-signin` })
            }
          })
      },
      inFavourites() {
        return this.$store.state.favoriteCoins && this.$store.state.favoriteCoins.find( coin =>  coin.symbol == 'BTC' )
      },
      initTradingViewChart() {
        var script = document.createElement('script');
        script.src = "https://s3.tradingview.com/tv.js"
        document.body.appendChild(script);

        var chimpPopup = document.createElement("script");
        chimpPopup.appendChild(document.createTextNode('new TradingView.widget({"autosize": true,"symbol": "BITFINEX:BTCUSD","interval": "D","timezone": "Etc/UTC","theme": "Light","style": "0","locale": "ru","toolbar_bg": "#f1f3f6","enable_publishing": false,"container_id": "tradingview_53a94"});'));

        script.onload = function() {
          document.body.appendChild(chimpPopup);
        }

        //var element = this.$refs["tradingview"];
        //element.addEventListener("wheel", onWheel);
      },


      price() {
        let coin = this.$store.state.coins.find( coin => coin.attributes.symbol == 'BTC' )
        if( coin ) {
          return this.formatPrice( coin.attributes.price_usd )
        }
        if( this.$store.state.pageSocketCoin 
            && this.$store.state.pageSocketCoin.attributes 
            && this.$store.state.pageSocketCoin.attributes.price_usd ) {
          return this.formatPrice( this.$store.state.pageSocketCoin.attributes.price_usd )
        }
        return this.formatPrice( this.attributes.price_usd )
      },

      watchSocketCoin() {
        if( this.$store.state.pageSocketCoin ) {
          console.log( this.$store.state.pageSocketCoin )
          this.$socket.emit( 'SubRemove', {subs: [`5~CCCAGG~${this.$store.state.pageSocketCoin.symbol}~USDT`]} )
        }
        this.$store.commit( 'SET_PAGE_SOCKET_COIN', this.attributes )
        this.$socket.emit( 'SubAdd', { subs: [`5~CCCAGG~${this.symbol}~USDT`] })
      },

      isUp: function ( coin ) {
        return {
          'up': coin.up,
          'down': !coin.up,
        }
      },
    },

    computed: {

      calculateBTC: {
        get: function () {
          return this.calculatorBTC
        },
        set: function( value ) {
          this.calculatorBTC = value
          this.calculatorUSD = value ? this.formatCalculator( value * this.attributes.price_usd, 2) : ''
          this.calculatorRUB = value ? this.formatCalculator( value * this.attributes.price_rub, 2) : ''
        }
      },

      calculateUSD: {
        get: function () {
          return this.calculatorUSD
        },
        set: function( value ) {
          this.calculatorBTC = value ? this.formatCalculator( value / this.attributes.price_usd, 6 ) : ''
          this.calculatorUSD = value
          this.calculatorRUB = value ? this.formatCalculator( this.attributes.price_rub * value / this.attributes.price_usd, 2 ) : ''
        }
      },

      calculateRUB: {
        get: function () {
          return this.calculatorRUB
        },
        set: function( value ) {
          this.calculatorBTC = value ? this.formatCalculator( value / this.attributes.price_rub, 6 ) : ''
          this.calculatorUSD = value ? this.formatCalculator( this.attributes.price_usd * value / this.attributes.price_rub, 2) : ''
          this.calculatorRUB = value
        }
      },
      activeFavourite: function () {
        return {
          'active_star': this.inFavourites()
        }
      },
    }

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
    return `Курс Биткоина в реальном времени на биржах к доллару/рублю. Биткойн калькулятор`
  }

  function getDescription (params) {
    if( params.meta_description ) {
      return params.meta_description
    }
    return `Курс Биткоина онлайн на графике к доллару, на разных биржах. Прогноз цены биткоина на сегодня, неделю, месяц. Биткойн калькулятор`
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

  function onWheel(e) {
    e = e || window.event;
    e.preventDefault ? e.preventDefault() : (e.returnValue = false);
  }

</script>