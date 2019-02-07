<template>
  <div class="ff_traders">
    <div class="ff_traders_description">
      Раздел для начинающих и профессиональных криптоинвесторов, где вы можете найти анализ топ-криптотрейдеров-консультантов. Откройте для себя лучшие криптовалютные сигналы на 2019 год. Мы проверяем криптовалютные каналы Telegram и показываем вам графики криптовалютных сигналов для получения достоверных результатов.
    </div>

    <ul class="ff_traders_list">
      <template v-for="trader of services">
        <li class="ff_trader_item">
          <div class="ff_trader_dt">
            <img v-if="trader.logo" class="trader_ava" src="trader.logo" alt="ff" >
            <h4 class="trader_name">
              {{ trader.name }}
            </h4>
          </div>
          <div class="ff_trader_dd">
            <table class="trader_ratings_block">
              <tbody>
                <tr class="trader_ratings_row">
                  <td>
                    <div class="ff_label">
                      Рейтинг
                    </div>
                    <div class="trader_value">
                      3.5
                    </div>
                    <no-ssr>
                      <star-rating 
                        :read-only="true" 
                        :rating="3.5" 
                        :increment="0.1" 
                        :show-rating="false" 
                        :star-size="20"

                        inactive-color="#fff"
                        border-color="#ba8600"
                        :border-width="1"
                        :rounded-corners="true"
                      >  
                      </star-rating>
                    </no-ssr>
                  </td>
                  <td>
                    <div class="ff_label">
                      Доходность
                    </div>
                    <div class="trader_value">
                      3.5
                    </div>
                    <no-ssr>
                      <star-rating 
                        :read-only="true" 
                        :rating="3.5" 
                        :increment="0.1" 
                        :show-rating="false" 
                        :star-size="20"

                        inactive-color="#fff"
                        border-color="#ba8600"
                        :border-width="1"
                        :rounded-corners="true"
                      >  
                      </star-rating>
                    </no-ssr>
                  </td>
                  <td>
                    <div class="ff_label">
                      Точность
                    </div>
                    <div class="trader_value">
                      3.5
                    </div>
                    <no-ssr>
                      <star-rating 
                        :read-only="true" 
                        :rating="3.5" 
                        :increment="0.1" 
                        :show-rating="false" 
                        :star-size="20"

                        inactive-color="#fff"
                        border-color="#ba8600"
                        :border-width="1"
                        :rounded-corners="true"
                      >  
                      </star-rating>
                    </no-ssr>
                  </td>
                  <td>
                    <div class="ff_label">
                      Цена
                    </div>
                    <div class="trader_value">
                      3.5
                    </div>
                    <no-ssr>
                      <star-rating 
                        :read-only="true" 
                        :rating="3.5" 
                        :increment="0.1" 
                        :show-rating="false" 
                        :star-size="20"

                        inactive-color="#fff"
                        border-color="#ba8600"
                        :border-width="1"
                        :rounded-corners="true"
                      >  
                      </star-rating>
                    </no-ssr>
                  </td>
                  <td>
                    <div class="ff_label">
                      Поддержка
                    </div>
                    <div class="trader_value">
                      3.5
                    </div>
                    <no-ssr>
                      <star-rating 
                        :read-only="true" 
                        :rating="3.5" 
                        :increment="0.1" 
                        :show-rating="false" 
                        :star-size="20"

                        inactive-color="#fff"
                        border-color="#ba8600"
                        :border-width="1"
                        :rounded-corners="true"
                      >  
                      </star-rating>
                    </no-ssr>
                  </td>
                </tr>
                <tr class="trader_stats_row">
                  <td>
                    <div class="ff_label">
                      Сроки сделок
                    </div>
                    <div class="trader_value">
                      <span class="ff_trader_prices_item" v-for="period of trader.periods_deals" >
                        {{ period }}
                      </span>
                    </div>
                  </td>

                  <td>
                    <div class="ff_label">
                      Команда
                    </div>
                    <div class="trader_value">
                      {{ trader.team }}
                    </div>
                  </td>

                  <td>
                    <div class="ff_label">
                      Страна
                    </div>
                    <div class="trader_value">
                      {{ trader.country }}
                    </div>
                  </td>

                  <td>
                    <div class="ff_label">
                      Сигналы
                    </div>
                    <div class="trader_value">
                      {{ trader.is_tech_analyze }}
                    </div>
                  </td>

                  <td>
                    <div class="ff_label">
                      Языки
                    </div>
                    <div class="trader_value">
                      <span class="ff_trader_prices_item" v-for="lang of trader.lang">
                        {{ lang }}
                      </span>
                    </div>
                  </td>
                </tr>

              </tbody>
            </table>
            <div class="trader_about" v-html="trader.description">
            </div>
          </div>
        </li>
        <li class="ff_trader_item trader_price_block">
          <div class="ff_trader_dt ff_label">
            Цены
          </div>
          <div class="ff_trader_dd trader_price">
            <span class="ff_trader_prices_item" v-for="price of trader.prices">
              {{ price }}
            </span>
          </div>
        </li>
        <li v-if="trader.promocode" class="ff_trader_item trader_promo_block">
          <div class="ff_trader_dt ff_label">
            Промокод
          </div>
          <div class="ff_trader_dd">
            {{ trader.promocode }}
          </div>
        </li>
      </template>
    </ul>


  </div>
</template>


<script>

  import StarRating from 'vue-star-rating'

  const API_SIGNALS_SERVICES = `/api/signals-services?include=comments,historypoints`

  export default {

    head() {
      return {
        title: 'Лучшие криптовалютные сигналы в Телеграм',
        meta: [
          { 
            hid: 'description', 
            name: 'description', 
            content: 'Сравните и выберите лучшие сигналы для Bitmex на Bitcoin и Альткоины. Анализ и отслеживание производительности.',
          },
        ],
      }
    },

    components: {
      StarRating,
    },

    data() {
      return {

      }
    },

    async asyncData ({ app }) {
      let services

      try {
        let servicesResponse = await app.$axios.get(API_SIGNALS_SERVICES)
        services = app.$dataFormatter.deserialize(servicesResponse.data)
      } catch (e) {
      }

      return {
        services,
      }

    },

    computed: {

    },

    methods: {

    }

  }

</script>