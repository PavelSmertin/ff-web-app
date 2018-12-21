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
        <input id="from_value" v-model.number="amount" @keyup="changeAmount" type="number" placeholder="Вы отдаёте" />
        <select v-model="from" @change="changeCoin" id="from_coin">
          <option value="RUB">RUB</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>
      </div>
      <div class="input-flex">
        <input id="to_value" v-model.number="amountTo" type="number" readonly placeholder="Вы получаете" />
        <select v-model="to" @change="changeCoin" id="to_coin">
          <option v-if="coin.isActive === true" v-for="(coin, symbol) in indacoinCoins" :key="symbol" :value="symbol">{{ symbol }}</option>
        </select>
      </div>
      <div class="input-flex">
        <input class="wallet" v-model="address" type="text" placeholder="Адрес вашего криптокошелька"/>
      </div>
      <div class="button_flex">
        <a class="button_link" :href="indacoinChangeUrl()" target="_blank">Обменять</a>
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

  import Jsona from 'jsona';

  const partner_id = `ff`;
  const indacoin_api_url = `https://indacoin.com/api`
  const indacoin_api_price = indacoin_api_url + `/GetCoinConvertAmount`

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
        from: 'USD',
        to: 'BTC',
        amount: null,
        amountTo: null,
        address: '',
        amountChangeTimer: null,
        error: ''
      }
    },

    mounted() {
      this.init()
    },

    methods: {
      init: function () {
        if (this.$route.query.from && this.$route.query.to) {
          this.from = this.$route.query.from
          this.to = this.$route.query.to
          this.amount = document.getElementById('from_value').value
          document.getElementById('from_coin').value = this.from
          document.getElementById('to_coin').value = this.to
        }
        this.calc()
      },

      changeCoin: function(e) {
        if (this.amount === '') {
          return
        }
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
        if (this.amount === '') {
          this.amountTo = ''
          return false
        }

        this.$axios.get(indacoin_api_price + `/` + this.from + `/` + this.to + `/` + this.amount + `/` + partner_id)
          .then(({data}) => {
            this.amountTo = data
          }).catch(e => {
          if (e.response) {
          }
        })
      },

      indacoinChangeUrl: function() {
        if ( (this.amount < 30 && this.from !== 'RUB') || (this.amount < 2000 && this.from === 'RUB') ) {
          this.error = 'Введите сумму которую хотите потратить на ' + this.to + '. Минимальная сумма обмена 30 USD/EUR или 2000 RUB'
          return false
        }
        if (this.address === '') {
          this.error = 'Заполните адрес вашего криптокошелька'
          return false
        }
        this.error = ''
        return 'https://indacoin.com/gw/payment_form?partner=ff&cur_from=' + this.from + '&cur_to=' + this.to + '&amount=' + this.amount + '&address=' + this.address// + '&user_id={UserID}'
      }
    }

  }

</script>