<template>
  <div class="ff_buy_coin_root">
    <div class="ff_buy_coin">
      <h1 class="margin40 mb-4">Покупайте криптовалюту моментально</h1>
      <div class="content">
        <p class="mr-4 mt-1"><img src="~assets/images/indacoin.png" /></p>
        <p>Indacoin — это простой и безопасный способ купить биткоины, а также более 100 других криптовалют при помощи Visa & Mastercard</p>
      </div>
      <div class="content">
        <p class="mr-3 mt-1"><img width="100" src="~assets/images/visa_mc.png" /></p>
        <p class="error">{{ error }}</p>
      </div>
      <div class="input-flex">
        <label>Вы отдаёте</label>
        <input id="from_value" v-model.number="amountFrom" @keyup="changeAmount" type="number" />
        <select v-model="from" @change="changeCoin" id="from_coin">
          <option value="RUB">RUB</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>
      </div>
      <div class="input-flex">
        <label>Вы получаете</label>
        <input id="to_value" v-model.number="amountTo" type="number" readonly />
        <select v-model="to" @change="changeCoin" id="to_coin">
          <option v-for="(coin) in indacoinCoins" :key="coin.attributes.symbol" :value="coin.attributes.symbol">
            {{ coin.attributes.symbol }}
          </option>
        </select>
      </div>
      <div class="input-flex">
        <input class="wallet" v-model="address" type="text" placeholder="Адрес вашего криптокошелька"/>
      </div>
      <div class="button_flex">
        <a class="button_link" v-bind="buyButtonState" target="_blank">Обменять</a>
      </div>
    </div>
    <div class="buy_coin_footer">
      <div class="ff_buy_coin">
        <div class="left">Регистрация в сервисе не обязательна. Вам достаточно ввести сумму платежа, на которую вы хотите
          совершить покупку, ваш номер мобильного телефона, e-mail, данные вашей карты и адрес крипто кошелька.
          Затем вы будете перенаправлены на страницу заказа.
        </div>
        <div class="right">Indacoin Limited, Suite 4b, 43 Berkeley Square, Mayfair, London, Westminster, United Kingdom,
          W1J 5FJ Company Number 08924450<br/>
          <br/>
          support@indacoin.com
          +44 207 048 25 82
        </div>
      </div>
    </div>
  </div>

</template>


<script>

  import CryptoValidator from 'cryptocurrency-address-validator'

  const PARTNER_ID = `ff`;
  const INDACOIN_API_PRICE = `https://indacoin.com/api/GetCoinConvertAmount`

  export default {

    head() {
      return {
        title: 'Покупка крипты',
        // meta: [
        //   {
        //     hid: 'description',
        //     name: 'description',
        //     content: 'Как нас найти? Что это такое?',
        //   },
        //   { hid: 'og:type', property: 'og:type', content: 'website' },
        //   { hid: 'og:url', property: 'og:url', content: process.env.baseUrl },
        //   { hid: 'og:image', property: 'og:image', content: process.env.baseUrl + '/FF_cover968_b.png' },
        //   { hid: 'twitter:image', name: 'twitter:image', content: process.env.baseUrl + '/FF_cover968_b.png' },
        //
        //   { hid: 'og:title', property: 'og:title', content: 'О компании' },
        //   { hid: 'og:description', property: 'og:description', content: 'Как нас найти? Что это такое?' },
        //   { hid: 'twitter:title', name: 'twitter:title', content: 'О компании' },
        //   { hid: 'twitter:description', name: 'twitter:description', content: 'Как нас найти? Что это такое?' },
        // ],

      }
    },

    data() {
      return {
        indacoinCoins: this.$store.state.indacoin.coins,

        from: this.$route.query.from ? this.$route.query.from : 'USD',
        to: this.$route.query.to ? this.$route.query.to : 'BTC',

        amountFrom: null,
        amountTo: null,

        address: '',
        amountChangeTimer: null,
        error: ''
      }
    },

    computed: {
      buyButtonState() {
        if( this.isFormValide() ) {
          return {
            'href': `https://indacoin.com/gw/payment_form?partner=ff&cur_from=${this.from}&cur_to=${this.to}&amount=${this.amountFrom}&address=${this.address}`
          }
        }
        return {
          'class': 'indacoin_disabled',
        }
      }
    },

    methods: {
      changeCoin: function(e) {
        this.calc()
      },

      changeAmount: function() {
        if (this.amountChangeTimer !== null) {
          clearTimeout(this.amountChangeTimer)
        }
        let my = this
        this.amountChangeTimer = setTimeout(function(){
          my.calc()
        }, 500)
      },

      calc: function() {
        if( this.amountFrom === '' ) {
          this.amountTo = ''
          return
        }

        this.$axios.get(`${INDACOIN_API_PRICE}/${this.from}/${this.to}/${this.amountFrom}/${PARTNER_ID}`)
          .then(({data}) => {
            this.amountTo = data
          }).catch(e => {
            if (e.response) {
            }
          })
      },

      isFormValide: function() {

        this.error = ''

        const minAmountUSD = 30
        const minAmountRUB = 2000

        if ( (this.amount < minAmountUSD && this.from !== 'RUB') || (this.amount < minAmountRUB && this.from === 'RUB') ) {
          this.error = `Введите сумму которую хотите потратить на ${this.to}. Минимальная сумма обмена ${minAmountUSD} USD/EUR или ${minAmountRUB} RUB`
          return false
        }
        if (this.address === '') {
          this.error = `Заполните адрес вашего криптокошелька`
          return false
        }

        try { 
          if ( CryptoValidator.validate(this.address, this.to) === false ) {
            this.error = `Некорректный адрес криптокошелька`
            return false
          }
        } catch (e) {
          //
        }

        return true
      }
    }

  }

</script>