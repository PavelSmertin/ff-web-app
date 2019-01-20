<template>
  <section class="ff_coin">
      
    <div class="coin_head_block">
      <div class="coin_title">
        <h1>Курс {{ getCase() }}</h1>
        <div class="coin_btns">
          <button class="subscribe" v-on:click="subscribe()">
            <div v-if="inSubscribed()">Отписаться</div>
            <div v-else>Подписаться</div>
          </button>
          <nuxt-link v-if="isActiveCoin(symbol)" class="button_buy_coin" :to="coinBuyUrl( symbol )">
            Купить {{ symbol }}
          </nuxt-link>
        </div>
      </div>

      <div class="coin_price">
        <div>
          <transition name="slide-fade" mode="out-in">
            <span 
              :key="price()" 
              class="coin_value"
              v-bind:class="isUp()"
            >
              ${{ price() }}
            </span>
          </transition>
          &nbsp;
          <span class="coin_unit">USD</span>&nbsp;
          <span class="coin_value positive" v-bind:class="{ negative: ($store.state.indexDetails.percent_change24h < 0) }">
            {{ $store.state.indexDetails.percent_change24h }}%
          </span>
        </div>
        <div class="coin_info_wrap">
          <span class="coin_info">{{ formatPrice( $store.state.indexDetails.price_rub ) }} RUB</span>&nbsp;
        </div>
      </div>
    </div>

    <div class="coin_tabs">
      <nuxt-link  
        :to="{path: '/'}"
        class="filters_tab" >
          Главное
      </nuxt-link>
      <nuxt-link 
        :to="{path: '/btc-indices'}"
        class="filters_tab" >
          Котировки
      </nuxt-link >
    </div>

    <nuxt-child />

  </section>
</template>


<script>
  import Jsona from 'jsona';
  import { coinsMixin } from '~/components/mixins/coins.js'
  import { indacoinMixin } from '~/components/mixins/indacoin.js'

  const dataFormatter = new Jsona()

  export default {

    mixins: [ indacoinMixin, coinsMixin ],

    head() {
      return {
        title: this.title(),
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

          { hid: 'og:title', property: 'og:title', content: `Курс bitcoin на сегодня - FF.ru` },
          { hid: 'og:description', property: 'og:description', content: this.headDescription },
          { hid: 'twitter:title', name: 'twitter:title', content: `Курс bitcoin на сегодня - FF.ru` },
          { hid: 'twitter:description', name: 'twitter:description', content: this.headDescription },
        ],

      }
    },

    data () {
      return {
        symbol: 'BTC',
        headTitle: getTitle( this.$store.state.indexDetails ),
        headDescription: getDescription( this.$store.state.indexDetails ),
      }
    },

    mounted () {
      this.goto()
      this.watchSocketCoin()
      this.sendPulsePushScript()
    },

    methods: {
      sendPulsePushScript() {
        var script = document.createElement('script');
        script.src = "//cdn.sendpulse.com/js/push/845b8969d01c47a192966fd308146a33_1.js"
        script.setAttribute('async', '')
        script.setAttribute('charset', 'UTF-8')
        document.head.appendChild(script);
      },

      watchSocketCoin() {
        if( this.$store.state.pageSocketCoin ) {
          this.$socket.emit( 'SubRemove', {subs: [`5~CCCAGG~${this.$store.state.pageSocketCoin.symbol}~USDT`]} )
        }
        this.$store.commit( 'SET_PAGE_SOCKET_COIN', this.$store.state.indexDetails )
        this.$socket.emit( 'SubAdd', { subs: [`5~CCCAGG~${this.symbol}~USDT`] })
      },

      goto() {
        var element = this.$parent.$refs["scroll-container"];
        element.scrollTo(0, 0);
      },
      getImageSharing() {
        return '/FF_cover968_b.png'
      },
      getCase() {
        return getCase(this.$store.state.indexDetails)
      },
      subscribe() {
        this.sendEvent( 'CoinSubscribe', 'subscribe', this.symbol );
        this.$axios.post(`/api/coin/subscribe?include=subscribedcoins`, `symbol=${this.symbol}`)
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
        return this.$store.state.subscribedCoins && this.$store.state.subscribedCoins.find( coin =>  coin.symbol == this.symbol )
      },
      price() {
        let coin = this.$store.state.coins.find( coin => coin.attributes.symbol == this.symbol )
        if( coin ) {
          return this.formatPrice( coin.attributes.price_usd )
        }
        if( this.$store.state.pageSocketCoin 
            && this.$store.state.pageSocketCoin.attributes 
            && this.$store.state.pageSocketCoin.attributes.price_usd ) {
          return this.formatPrice( this.$store.state.pageSocketCoin.attributes.price_usd )
        }
        return this.formatPrice( this.$store.state.indexDetails.price_usd )
      },

      title() {
        if( process.server ) {
          return getTitle(this.$store.state.indexDetails)
        } else {

          let title = `${this.price()}$ ${this.dinamic()}${this.$store.state.indexDetails.percent_change24h}% — Курс Биткоина в реальном времени на биржах к доллару/рублю. Биткойн калькулятор`
          document.title = title
          return title
        }
      },
      dinamic() {
        return this.$store.state.indexDetails.percent_change24h > 0 ? '▲' : '▼'
      },
      isUp: function ( coin ) {
        return {
          'up': this.$store.state.indexDetails.up,
          'down': !this.$store.state.indexDetails.up,
        }
      },
    },
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

  function getCase (params) {
    if(params.cases && params.cases.ro) {
      return params.cases.ro
    }

    if(params.cases && params.cases.im) {
      return params.cases.im
    }

    return params.coin_name
  }

</script>