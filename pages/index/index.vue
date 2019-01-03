<template>
  <section class="ff_coin">
      
    <div class="coin_head_block">
      <div class="coin_title">
        <div class="coin_favourite_hover" v-on:click="watch()">
          <span class="button_icon ic_star" v-bind:class="activeFavourite"></span>
          <h1>Курс {{ getBTCCase() }}</h1>
        </div>

        <div class="coin_btns">
          <button class="subscribe" v-on:click="subscribe()">
            <div v-if="inSubscribed()"><span class="subscribe_icon">&minus;</span>Не отслеживать</div>
            <div v-else><span class="subscribe_icon">&plus;</span> Отслеживать {{ attributes.symbol }}</div>
          </button>
          <nuxt-link v-if="isActiveCoin(attributes.symbol)" class="button_buy_coin" :to="coinBuyUrl( attributes.symbol )">
            Купить {{attributes.symbol}}
          </nuxt-link>
        </div>

      </div>

      <div class="coin_price">
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
        <div class="coin_info_wrap">
          <span class="coin-info">{{ formatPrice(attributes.price_rub) }} RUB</span>&nbsp;
        </div>
      </div>

    </div>


    <div class="coin_tabs">
      <a 
        href="#" 
        class="filters_tab" 
        v-on:click.stop.prevent="switchIndexTab('index_main')"
        v-bind:class="indexPaneMain">
          Главное
      </a>
      <a 
        href="#" 
        class="filters_tab" 
        v-on:click.stop.prevent="switchIndexTab('index_stat')"
        v-bind:class="indexPaneStat">
          Котировки
      </a>
    </div>

    <transition name="pane">
      <div class="index_pane" v-if="activeIndexTab=='index_main'">
        <div class="margin12 content_padding" v-if="popularNews.length">
          <h2 class="margin12">Популярное</h2>
            <div class="ff_news ff_popular">
              <nuxt-link @click.native="onPostClick(newest.id)" v-for="newest of popularNews" v-bind:key="newest.id" :to="linkToPost(newest)" class="ff_news_row">
                <post-item :post="newest" ></post-item>
              </nuxt-link>
            </div>
        </div>

        <div class="tt_graph_wrap">
          <div class="tt_graph_head content_padding">
            <h2>Доля Bitcoin в портфелях трейдеров</h2>
            <a href="https://tt.ff.ru" target="_blank" class="button_tt_link">Узнать больше</a>
          </div>
          <ttGraph
              class="border_top tt_graph"
              :first="{color: '#8FCC14', gradient: 'GradientFirst', opacity: 1 }" 
              :second="{color: '#000', gradient: 'GradientSecond', opacity: 0.2 }"
              :interactive="true"
              :mainCoin="true"
          />
        </div>

        <div class="border_top content_padding">
          <h2 class="margin12">Биткойн калькулятор</h2>
        </div>
        <div class="calculator margin6 content_padding">
          <div class="calculator_item">
            <div class="label"><img src="~/assets/images/btc_icon_white.png" width="20" height="20" alt="btc_icon"><span class="label_currency">BTC</span></div>
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

        <div class="border_top margin24 content_padding">
          <h3 class="margin12">Полезная информация</h3>
        </div>

        <div class="margin6 wiki_block content_padding">
          <nuxt-link @click.native="onWikiClick(1)" class="wiki_item" :to="{ path: '/wiki/1' }">
            <p class="wiki_title">Как купить биткоин?</p>
            <p class="wiki_description">Инструкция: как купить биткоин онлайн надежно с карты за рубли, доллары или через электронные кошельки QIWI, Webmoney</p>
          </nuxt-link>
          <nuxt-link @click.native="onWikiClick(2)" class="wiki_item" :to="{ path: '/wiki/2' }">
            <p class="wiki_title">Где хранить биткоины?</p>
            <p class="wiki_description">Важно выбрать наиболее надежный и удобный способ хранения биткоина, для этого подойдут Bitcoin кошельки. Существует несколько типов кошельков, разберемся какой лучше</p>
          </nuxt-link>        
          <nuxt-link @click.native="onWikiClick(3)" class="wiki_item" :to="{ path: '/wiki/3' }">
            <p class="wiki_title">Что такое блокчейн?</p>
            <p class="wiki_description">BlockChain (англ. Block – блок; Chain - цепь) - это база данных, которая ежедневно пополняется информацией о криптовалютных переводах между пользователями</p>
          </nuxt-link>
          <nuxt-link @click.native="onWikiClick(4)"  class="wiki_item" :to="{ path: '/wiki/4' }">
            <p class="wiki_title">Как продать биткоин?</p>
            <p class="wiki_description">Продать или обналичить биткоины можно нескольким способами, например через биржи, обменники или с помощью карты</p>
          </nuxt-link>
          <nuxt-link @click.native="onWikiClick(5)" class="wiki_item" :to="{ path: '/wiki/5' }">
            <p class="wiki_title">Биткоин в России</p>
            <p class="wiki_description">Биткоин в России использовать можно, отношение государства к криптовалюте на данный момент носит неопределенный характер</p>
          </nuxt-link>
          <nuxt-link @click.native="onWikiClick(6)" class="wiki_item" :to="{ path: '/wiki/6' }">
            <p class="wiki_title">Что такое Биткоин?</p>
            <p class="wiki_description">Биткоин - первая криптовалюта, ставшая всемирно-известной в 2017 году. Основная суть биткоина состоит в децентрализации</p>
          </nuxt-link>
        </div>

        <div class="index_text_wrap">
          <section 
            v-if="attributes.seo_text" 
            class="ff_text_block" 
            v-html="attributes.seo_text" 
            v-bind:class="indexSeoText"
            >
          </section>
          <button 
            class="button_class seo_text_toggle" 
            v-on:click.stop.prevent="toggleSeoText()" 
            v-bind:class="indexSeoText" 
            v-html="toggleSeoAction"
            >
          </button>
        </div>
      </div>
    </transition>

    <transition name="pane">
      <div class="index_pane" v-if="activeIndexTab=='index_stat'">
        <div class="coin_details_block content_padding">

            <div class="coin_detail_unit">
              <div class="ff-label">Капитализация</div>
              <div class="coin-detail">{{ formatPrice(attributes.market_cap_usd) }} USD</div>
              <div class="coin-detail-info">{{ formatPrice(attributes.total_coin_supply) }} {{attributes.symbol }}</div>
            </div>

            <div class="coin_detail_unit">
              <div class="ff-label">Объем торгов (24ч)</div>
              <div class="coin-detail">{{ formatPrice(attributes.volume24h_usd) }} USD</div>
              <div class="coin-detail-info">{{ formatPrice(attributes.volume24h_btc) }} {{ attributes.symbol }}</div>
            </div>

            <div class="coin_detail_unit">
              <div class="ff-label">Изменение (1ч)</div>
              <div class="coin-detail positive" v-bind:class="{ negative: (attributes.change1h_usd < 0) }">
                {{ formatPrice(attributes.percent_change1h) }}%
              </div>
              <div class="coin-detail-info positive" v-bind:class="{ negative: (attributes.change1h_usd < 0) }">
                {{ formatPrice(attributes.change1h_usd) }} USD
              </div>
            </div>

            <div class="coin_detail_unit">
              <div class="ff-label">Изменение (24ч)</div>
              <div class="coin-detail positive" v-bind:class="{ negative: (attributes.change24h_usd < 0) }">
                {{ formatPrice(attributes.percent_change24h) }}%
              </div>
              <div class="coin-detail-info positive" v-bind:class="{ negative: (attributes.change24h_usd < 0) }">
                {{ formatPrice(attributes.change24h_usd) }} USD
              </div>
            </div>

            <div class="coin_detail_unit">
              <div class="ff-label">Изменение (7д)</div>
              <div class="coin-detail positive" v-bind:class="{ negative: (attributes.change7d_usd < 0) }">
                {{ formatPrice(attributes.percent_change7d) }}%
              </div>
              <div class="coin-detail-info positive" v-bind:class="{ negative: (attributes.change7d_usd < 0) }">
                {{ formatPrice(attributes.change7d_usd) }} USD
              </div>
            </div>
        </div>

        <h2 class="border_top padding12 content_padding">Курс BTC/USDT на биржах</h2>

        <div class="margin6 pairs_row content_padding">
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
              <div class="ff_pair_item i_volume">{{ formatPrice(pair.volume24hour) }}</div>
            </div>
          </div>
        </div>

        <div class="border_top margin24">
          <h3 class="margin12 content_padding">Лидеры криптовалют за 24 часа</h3>
          <div class="margin12 align_right content_padding">
              <nuxt-link class="h_link" :to="{ path: '/coins' }">Все монеты</nuxt-link>
          </div>
        </div>
        <coins-list-other :otherCoins="otherCoins" />

        <div class="border_top margin24 content_padding">
          <h3 class="margin12">Быстрая статистика Биткоина</h3>
        </div>
        <div class="margin6 content_padding">
          <dl class="coin_stat">
            <dt>Дата запуска</dt><dd>Январь 3, 2009</dd>
            <dt>Позиция в рейтинге MarketCap</dt><dd>№1</dd>
            <dt>ATH</dt><dd>$19 665.39</dd>
            <dt>С момента достижения ATH</dt><dd>-70%</dd>
            <dt>Дата ATH</dt><dd>16.12.2017</dd>
            <dt>Доступный объем</dt><dd>17.1 миллионов</dd>
            <dt>Общий объем</dt><dd>21.0 миллион</dd>
            <dt>Официальный сайт</dt><dd>bitcoin.org</dd>
            <dt>Форум</dt><dd>bitcointalk.org</dd>
            <dt>Алгоритм хеширования</dt><dd>SHA-256</dd>
            <dt>Скорость хеширования</dt><dd>577,744 PH/s</dd>
            <dt>Время между блоками</dt><dd>10 минут</dd>
          </dl>
        </div>
      </div>
    </transition>

  </section>
</template>


<script>
  import Vue from 'vue'
  import axios from 'axios'
  import CoinsListOther from '~/components/CoinsListOther.vue'
  import PostItem from '~/components/PostItem.vue'

  import ttGraph from '~/components/ttGraph.vue'
  import Jsona from 'jsona';
  import { analMixin } from '~/components/mixins/analitics.js'
  import { coinsMixin } from '~/components/mixins/coins.js'
  import { indacoinMixin } from '~/components/mixins/indacoin.js'

  const REQUEST_COIN = `/api/portfolios/free-coin/`
  const REQUEST_GRAPH = `/api/portfolios/coin-graph/`

  const dataFormatter = new Jsona()

  export default {

    mixins: [ analMixin, indacoinMixin, coinsMixin ],

    head() {
      return {
        title: this.title(),
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
        showTooltip: false,
        activeIndexTab: 'index_main',
        seoTextCollapsed: true,
      }
    },

    async asyncData ({ app, params, error, isDev }) {

      let symbol = 'BTC'
      let details 
      let pairs
      let otherCoins
      let popularNews
      try {
        let [ responseDetails, responsePairs, responseOtherCoins, responsePopularNews ] = await Promise.all([
          app.$axios.get(`/api/coin/full-list?per-page=2000&filters[portfolio-coins][symbol]=BTC`),
          app.$axios.get(`/api/exchanges/BTC/top?include=exchange&fields[portfolio-exchange]=name&fields[portfolio-exchange]=name&per-page=10`),
          app.$axios.get(`/api/coins/BTC/other?per-page=8`),
          app.$axios.get(`/api/news/popular?fields[news-translated]=id,title,votes_positive,votes_negative,create_dt,type,slug,source_url,images,is_top`),
        ])

        details     = dataFormatter.deserialize(responseDetails.data)
        pairs       = dataFormatter.deserialize(responsePairs.data)
        otherCoins  = responseOtherCoins.data.data
        popularNews = dataFormatter.deserialize( responsePopularNews.data )
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
        popularNews,
        calculatorBTC: 1,
        calculatorUSD: attributes.price_usd,
        calculatorRUB: attributes.price_rub,
      }
    },

    components: {
      CoinsListOther,
      PostItem,
      ttGraph,
    },

    mounted () {
      this.goto()
      this.watchSocketCoin()
      this.sendPulsePushScript()

      if( this.$store.state.graphs['BTC'] == undefined ) {
        this.retrieveGraph()
      }
    },

    methods: {
      goto() {
        var element = this.$parent.$refs["scroll-container"];
        element.scrollTo(0, 0);
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
      subscribe() {
        this.sendEvent( 'CoinSubscribe', 'subscribe', this.symbol );
        this.$axios.post(`/api/coin/subscribe?include=subscribedcoins`, `symbol=BTC`)
          .then(({ data }) => {
            let response = dataFormatter.deserialize( data )
            this.$store.commit('SET_SUBSCRIBED_COINS', response.subscribedcoins)
          }).catch(e => {
            if (e.response && e.response.status == 401) {
              this.$router.push({ name: `account-signin` })
            }
          })
      },
      inSubscribed() {
        return this.$store.state.subscribedCoins && this.$store.state.subscribedCoins.find( coin =>  coin.symbol == 'BTC' )
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
      sendPulsePushScript() {
        var script = document.createElement('script');
        script.src = "//cdn.sendpulse.com/js/push/845b8969d01c47a192966fd308146a33_1.js"
        script.setAttribute('async', '')
        script.setAttribute('charset', 'UTF-8')
        document.head.appendChild(script);
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

      title() {
        if( process.server ) {
          return getTitle( this.attributes )
        } else {

          let title = `${this.price()}$ ${this.dinamic()}${this.attributes.percent_change24h}% — Курс Биткоина в реальном времени на биржах к доллару/рублю. Биткойн калькулятор`
          document.title = title
          return title
        }
      },

      dinamic() {
        return this.attributes.percent_change24h > 0 ? '▲' : '▼'
      },

      watchSocketCoin() {
        if( this.$store.state.pageSocketCoin ) {
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

      linkToPost: function (post) {
        if( post.slug ) {
          return { name: 'slug-id', params: { id: post.id, slug: post.slug, newest:  post, }}
        } else {
          return { name: 'index-symbol-id', params: { 
              symbol: this.$route.params.symbol ? this.$route.params.symbol : 'btc',
              id: post.id, 
              newest:  post,
            }
          }

        }
      },

      onPostClick: function ( postId ) {
        this.sendEvent( 'PopularNews', 'click', postId );
      },

      coinBuyUrl: function( symbol ) {
        return '/buy-coin?from=USD&to=' + symbol
      },

      async retrieveCoin () {
        try {
          const data = await this.$axios.get(requestCoin( 'BTC', {} ))
          let coinName = this.coin.coin_name
          let coinPrice = this.coin.coin_price
          let coinPriceChange = this.coin.price_percent_change
          this.coin = dataFormatter.deserialize( data.data )
          if( this.coin == undefined ) {
            this.coin = {
                  coin_name: coinName,
                  symbol: 'BTC', 
                  coin_price: coinPrice,
                  price_percent_change: coinPriceChange,
                  part: null, 
                  amount_total: null, 
                  amount_total_usdt: null, 
                  part_change: null,
                }
          }
        } catch( e ) {
          if( process.env.NODE_ENV == 'development'  ) {
            console.error(e)
          }
        }
      },

      async retrieveGraph () {
        var nodes = []

        try {
          const data = await this.$axios.get(requestGraph( 'BTC', {} ))
          this.$store.commit( 'SET_GRAPH', {symbol: 'BTC', data: data.data['BTC']} )
        } catch( e ) {
          if( process.env.NODE_ENV == 'development' ) {
            console.error(e)
          }
        }
      },

      switchIndexTab ( activeTab ) {
        this.activeIndexTab = activeTab
        return {
          'class' : 'active_index_pane'
        }
      },
      switchIndexStats () {
        return {
          'class' : 'active_index_pane'
        }      
      },
      toggleSeoText () {
        this.seoTextCollapsed = !this.seoTextCollapsed
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
      indexSeoText: function () {
        return {
          'ff_text_collapased' : this.seoTextCollapsed,
          'ff_text_expanded' : !this.seoTextCollapsed,
        }      
      },
      toggleSeoAction: function () {
          return this.seoTextCollapsed ? 'Развернуть <span>&#9660;</span>' : 'Свернуть <span>&#9650;</span>'
      },
      indexPaneMain: function () {
        return {
          'active_index_pane' : this.activeIndexTab == 'index_main'
        }
      },
      indexPaneStat: function () {
        return {
          'active_index_pane' : this.activeIndexTab == 'index_stat'
        }
      },
    }

  }

  function requestCoin( symbol, filters ) {
    let filterQuery = 
          ( filters.cap ? '?cap=' + filters.cap : '' ) + 
          ( filters.period ? '&period=' + filters.period : '' ) +
          ( filters.profit ? '&profit=' + filters.profit : '' ) 
    return REQUEST_COIN + symbol +  filterQuery
  }

  function requestGraph( symbol, filters ) {
    let filterQuery = 
          ( filters.cap ? '?cap=' + filters.cap : '' ) + 
          ( filters.period ? '&period=' + filters.period : '' ) +
          ( filters.profit ? '&profit=' + filters.profit : '' )
    return REQUEST_GRAPH + symbol +  filterQuery
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