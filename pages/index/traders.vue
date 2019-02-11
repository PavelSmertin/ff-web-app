<template>
  <div class="ff_traders">
    <h1>
      Рейтинг криптовалютных сигналов
    </h1>
    <div class="ff_traders_description">
      Раздел для начинающих и профессиональных криптоинвесторов, где вы можете найти анализ топ-криптотрейдеров-консультантов. Откройте для себя лучшие криптовалютные сигналы на 2019 год. Мы проверяем криптовалютные каналы Telegram и показываем вам графики криптовалютных сигналов для получения достоверных результатов.
    </div>

    <ul class="ff_traders_list">
      <template v-for="trader of services">
        <li class="ff_trader_item margin60" :ref="'coolpased_text_'+trader.id">
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
                        class="star_rating"
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
                      
                    </div>
                  </td>

                  <td>
                    <div class="ff_label">
                      Сигналы
                    </div>
                    <div class="trader_value">
                      
                    </div>
                  </td>

                  <td>
                    <div class="ff_label">
                      Языки
                    </div>
                    <div class="trader_value">
                      <span class="ff_trader_prices_item" v-for="lang of trader.lang">
                        
                      </span>
                    </div>
                  </td>
                </tr>

              </tbody>
            </table>

            <div v-if="trader.description && trader.description.length > 0" class="collapsed_text_wrap">
              <section 
                class="trader_about collapsed_text" 
                v-html="trader.description"
                v-bind:class="indexSeoText(trader.id)"
                >
              </section>
              <button 
                class="button_class seo_text_toggle" 
                v-on:click.stop.prevent="toggleSeoText(trader.id)" 
                v-bind:class="indexSeoText(trader.id)" 
                v-html="toggleSeoAction(trader.id)"
                >
              </button>
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

        <li class="ff_trader_item trader_action_tools">
          <a v-if="trader.contact_link" :href="trader.contact_link" class="subscribe" rel="nofollow noopener">
            <span class="button_icon"><span class="trader_tg"></span></span>
            <span class="button_body">Admin</span>
          </a>

          <a v-if="trader.site_url" :href="trader.site_url" class="subscribe" rel="nofollow noopener">
            <span class="button_icon"><span class="trader_site"></span></span>
            <span class="button_body">Site</span>
          </a>

          <a v-if="trader.tg_url" :href="trader.tg_url" class="subscribe" rel="nofollow noopener">
            <span class="button_icon"><span class="trader_tg"></span></span>
            <span class="button_body">Telegram</span>
          </a>
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
        expandedRows: [],
      }
    },

    async asyncData ({ app }) {
      let services

      try {
        let servicesResponse = await app.$axios.get(API_SIGNALS_SERVICES)
        services = app.$dataFormatter.deserialize(servicesResponse.data)

        console.log(services)
      } catch (e) {
      }

      return {
        services,
      }

    },

    computed: {

    },

    methods: {
      goto( element ) {
        let topPos = element.offsetTop;
        let scrollParent = this.getScrollParent()
        scrollParent.scrollTo(0, topPos)
      },
      getScrollParent() {
        return this.$parent.$refs["scroll-container"]
      },
      indexSeoText(id) {
        return {
          'ff_text_collapased' : !this.expandedRows.includes(id),
          'ff_text_expanded' : this.expandedRows.includes(id),
        }      
      },
      toggleSeoAction(id) {
        return !this.expandedRows.includes(id) ? 'Развернуть <span>&#9660;</span>' : 'Свернуть <span>&#9650;</span>'
      },
      toggleSeoText(id) {
        const index = this.expandedRows.indexOf(id);
        if( index > -1 ) {
          this.expandedRows.splice(index, 1)
          this.goto( this.$refs['coolpased_text_' + id][0] )
        } else {
          this.expandedRows.push(id)
        }
      },
    }

  }

</script>