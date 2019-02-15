<template>
  <div class="ff_traders">
    <div class="ff_trader_head">
      <h1 class="ff_trader_title">
        Рейтинг криптовалютных сигналов
      </h1>
      <div class="ff_traders_description">
        Раздел для начинающих и профессиональных криптоинвесторов, где вы можете найти анализ топ-криптотрейдеров-консультантов. Откройте для себя лучшие криптовалютные сигналы на 2019 год. Мы проверяем криптовалютные каналы Telegram и показываем вам графики криптовалютных сигналов для получения достоверных результатов.
      </div>
    </div>

    <ul class="ff_traders_list">
      <li class="ff_trader_item" v-for="trader of services">

        <div class="ff_trader_item_row" :ref="'coolpased_text_'+trader.id">
          <div class="ff_trader_dt">
            <img v-if="trader.logo" class="trader_ava" :src="'/images/uploads/signal-services/logo/' + trader.logo" :alt="trader.name" >
          </div>

          <div class="ff_trader_dd">
            <h2>{{ trader.name }}</h2>
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
        </div>

        <div class="ff_trader_item_row trader_ratings_block">
          <table>
            <tbody>
              <tr class="trader_ratings_row">
                <td>
                  <div class="ff_label">
                    Рейтинг
                  </div>
                  <div class="pie-wrapper progress-95 style-2">
                    <span class="label">{{ trader.rating_common ? trader.rating_common : '-' }}</span>
                    <div class="pie">
                      <div class="left-side half-circle"></div>
                      <div class="right-side half-circle"></div>
                    </div>
                    <div class="shadow"></div>
                  </div>
                </td>
                <td>
                  <div class="ff_label">
                    Доходность
                  </div>
                  <div class="pie-wrapper progress-95 style-2">
                    <span class="label">{{ trader.rating_profit ? trader.rating_profit : '-' }}</span>
                    <div class="pie">
                      <div class="left-side half-circle"></div>
                      <div class="right-side half-circle"></div>
                    </div>
                    <div class="shadow"></div>
                  </div>
                </td>
                <td>
                  <div class="ff_label">
                    Точность
                  </div>
                  <div class="pie-wrapper progress-95 style-2">
                    <span class="label">{{ trader.rating_accuracy ? trader.rating_accuracy : '-' }}</span>
                    <div class="pie">
                      <div class="left-side half-circle"></div>
                      <div class="right-side half-circle"></div>
                    </div>
                    <div class="shadow"></div>
                  </div>
                </td>
                <td>
                  <div class="ff_label">
                    Цена
                  </div>
                  <div class="pie-wrapper progress-95 style-2">
                    <span class="label">{{ trader.rating_price ? trader.rating_price : '-' }}</span>
                    <div class="pie">
                      <div class="left-side half-circle"></div>
                      <div class="right-side half-circle"></div>
                    </div>
                    <div class="shadow"></div>
                  </div>
                </td>
                <td>
                  <div class="ff_label">
                    Поддержка
                  </div>
                  <div class="pie-wrapper progress-95 style-2">
                    <span class="label">{{ trader.rating_support ? trader.rating_support : '-' }}</span>
                    <div class="pie">
                      <div class="left-side half-circle"></div>
                      <div class="right-side half-circle"></div>
                    </div>
                    <div class="shadow"></div>
                  </div>
                </td>
              </tr>
              <tr class="trader_stats_row">
                <td>
                  <div class="ff_label">
                    Сроки сделок
                  </div>
                  <div class="trader_value">
                    <span v-for="period of trader.periods_deals" >
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
                    <span class="ff_trader_flag">{{ getFlag(trader.country) }}</span>
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
                    <span class="ff_trader_flag" v-for="lang of trader.lang">
                      {{ getFlag(lang) }}
                    </span>
                  </div>
                </td>
              </tr>

            </tbody>
          </table>
        </div>

        <div v-if="trader.prices" class="ff_trader_item_row trader_price_block">
          <div class="price_title">
            Цены
          </div>
          <div class="trader_price">
            <div v-for="price of trader.prices" class="price_card">
              <div class="price_value">0,09 BTC</div>
              <div class="price_label">3 месяца</div>
            </div>
          </div>
        </div>

        <div class="ff_trader_item_row trader_action_tools">
          <div class="ff_trader_promo">
            <span class="ff_label">
              Промокод
            </span>
            <span class="ff_bold">
              {{ trader.promocode ? trader.promocode : '-'}}
            </span>
          </div>

          <a v-if="trader.contact_link" :href="trader.contact_link" class="subscribe" rel="nofollow noopener" target="_blank">
            <span class="trader_tg"></span>Admin
          </a>
          <a v-if="trader.site_url" :href="trader.site_url" class="subscribe" rel="nofollow noopener" target="_blank">
            <span class="trader_site"></span>Site
          </a>
          <a v-if="trader.tg_url" :href="trader.tg_url" class="subscribe" rel="nofollow noopener" target="_blank">
            <span class="trader_tg"></span>Telegram
          </a>
        </div>

      </li>
    </ul>


  </div>
</template>


<script>

  import Emoji from '~/assets/js/emoji.json'

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

    data() {
      return {
        expandedRows: [],
        flags: Emoji,
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
      getFlag( litera ) {
        let flag = this.flags.find(el => el.aliases.includes(litera))
        return flag ? flag.emoji : this.flags[0].emoji
      }
    }

  }

</script>