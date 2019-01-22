<template>
  <div class="index_pane">
    <div class="coin_details_block content_padding">

        <div class="coin_detail_unit">
          <div class="ff_label">Капитализация</div>
          <div class="coin_detail">{{ formatPrice($store.state.indexDetails.market_cap_usd) }} USD</div>
          <div class="coin_detail_info">{{ formatPrice($store.state.indexDetails.total_coin_supply) }} BTC</div>
        </div>

        <div class="coin_detail_unit">
          <div class="ff_label">Объем торгов (24ч)</div>
          <div class="coin_detail">{{ formatPrice($store.state.indexDetails.volume24h_usd) }} USD</div>
          <div class="coin_detail_info">{{ formatPrice($store.state.indexDetails.volume24h_btc) }} BTC</div>
        </div>

        <div class="coin_detail_unit">
          <div class="ff_label">Изменение (1ч)</div>
          <div class="coin_detail positive" v-bind:class="{ negative: ($store.state.indexDetails.change1h_usd < 0) }">
            {{ formatPrice($store.state.indexDetails.percent_change1h) }}%
          </div>
          <div class="coin_detail_info positive" v-bind:class="{ negative: ($store.state.indexDetails.change1h_usd < 0) }">
            {{ formatPrice($store.state.indexDetails.change1h_usd) }} USD
          </div>
        </div>

        <div class="coin_detail_unit">
          <div class="ff_label">Изменение (24ч)</div>
          <div class="coin_detail positive" v-bind:class="{ negative: ($store.state.indexDetails.change24h_usd < 0) }">
            {{ formatPrice($store.state.indexDetails.percent_change24h) }}%
          </div>
          <div class="coin_detail_info positive" v-bind:class="{ negative: ($store.state.indexDetails.change24h_usd < 0) }">
            {{ formatPrice($store.state.indexDetails.change24h_usd) }} USD
          </div>
        </div>

        <div class="coin_detail_unit">
          <div class="ff_label">Изменение (7д)</div>
          <div class="coin_detail positive" v-bind:class="{ negative: ($store.state.indexDetails.change7d_usd < 0) }">
            {{ formatPrice($store.state.indexDetails.percent_change7d) }}%
          </div>
          <div class="coin_detail_info positive" v-bind:class="{ negative: ($store.state.indexDetails.change7d_usd < 0) }">
            {{ formatPrice($store.state.indexDetails.change7d_usd) }} USD
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
</template>

<script>
  import CoinsListOther from '~/components/CoinsListOther.vue'
  import { coinsMixin } from '~/components/mixins/coins.js'

  const REQUEST_PAIRS 		= `/api/exchanges/BTC/top?include=exchange&fields[portfolio-exchange]=name&fields[portfolio-exchange]=name&per-page=10`
  const REQUEST_OTHER_COINS = `/api/coins/BTC/other?per-page=8`

  export default {

    mixins: [ coinsMixin ],

    head() {
      return {
		link: [{ rel: 'canonical', href: 'https://ff.ru' },],
      }
    },

    async asyncData ({ app, error }) {

      let pairs
      let otherCoins

      try {
        let [ responsePairs, responseOtherCoins ] = await Promise.all([
          app.$axios.get(REQUEST_PAIRS),
          app.$axios.get(REQUEST_OTHER_COINS),
        ])
        pairs       = app.$dataFormatter.deserialize(responsePairs.data)
        otherCoins  = responseOtherCoins.data.data
      } catch (e) {
      }

      return {
        pairs,
        otherCoins,
      }
    },

    components: {
      CoinsListOther,
    },

  }

</script>