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
            <nuxt-link :to="linkToTrader(trader)">
              <img v-if="trader.logo" class="trader_ava" :src="'/images/uploads/signal-services/logo/' + trader.logo" :alt="trader.name" >
            </nuxt-link>
          </div>

          <div class="ff_trader_dd">
            <nuxt-link :to="linkToTrader(trader)">
              <h2>{{ trader.name }}</h2>
            </nuxt-link>
            <div v-if="trader.short_descr && trader.short_descr.length > 0">
              <section 
                class="trader_about collapsed_text" 
                >
                {{ trader.short_descr }}
              </section>
            </div>
          </div>
        </div>

        <div v-if="trader.historypoints" class="tt_graph_wrap margin24">
          <no-ssr>
            <ttGraph
              class="border_top tt_graph"
              :dataPoints="trader.historypoints"
              :first="{color: '#8FCC14', gradient: 'GradientFirst', opacity: 1 }" 
              :second="{color: '#000', gradient: 'GradientSecond', opacity: 0.2 }"
              :interactive="true" 
            />
          </no-ssr>
        </div>
        <div v-else class="tt_graph_empty margin24">
          <span class="trader_alert"></span>Подтвержденные данные торгов не предоставлены
        </div>

        <div class="ff_trader_item_row trader_stats_block">
          <div class="stats_item">
            <div class="ff_label">
              Сроки сделок
            </div>
            <div class="trader_value">
              <span v-for="period of trader.periods_deals" >
                {{ period }}
              </span>
            </div>
          </div>

          <div class="stats_item">
            <div class="ff_label">
              Команда
            </div>
            <div class="trader_value">
              {{ trader.team }}
            </div>
          </div>

          <div class="stats_item">
            <div class="ff_label">
              Страна
            </div>
            <div class="trader_value">
              <span class="ff_trader_flag">{{ getFlag(trader.country) }}</span>
            </div>
          </div>

          <div class="stats_item">
            <div class="ff_label">
              Сигналы
            </div>
            <div class="trader_value">
              
            </div>
          </div>

          <div class="stats_item">
            <div class="ff_label">
              Языки
            </div>
            <div class="trader_value">
              <span class="ff_trader_flag" v-for="lang of trader.lang">
                {{ getFlag(lang) }}
              </span>
            </div>
          </div>
        </div>

        <div v-if="trader.prices">
          <div v-for="group of trader.prices.groupPlans" class="ff_trader_item_row trader_price_block">
            <div class="price_title">
              {{ group.name == 'default' ? 'Цены' : group.name }}
            </div>
            <div class="trader_price">
              <div v-for="plan of group.plans" class="price_card">
                <div class="price_value">{{ plan.amount }}</div>
                <div class="price_label">{{ plan.name }}</div>
              </div>
            </div>
          </div>
        </div>


        <div class="ff_trader_item_row ff_trader_promo">
          <span class="ff_label">
            Промокод
          </span>
          <span class="ff_bold">
            {{ trader.promocode ? trader.promocode : '&mdash;'}}
          </span>
        </div>

        <div class="ff_trader_item_row trader_action_tools">
          <a v-if="trader.contact_link" :href="trader.contact_link" class="subscribe" rel="nofollow noopener" target="_blank">
            <span class="trader_tg"></span>Admin
          </a>
          <a v-if="trader.site_url" :href="trader.site_url" class="subscribe" rel="nofollow noopener" target="_blank">
            <span class="trader_site"></span>Site
          </a>
          <a v-if="trader.tg_url" :href="trader.tg_url" class="subscribe" rel="nofollow noopener" target="_blank">
            <span class="trader_tg"></span>Telegram
          </a>
          <nuxt-link :to="linkToTrader(trader)" class="subscribe">
            <span class="trader_comments"></span>Отзывы
          </nuxt-link>
          <nuxt-link :to="linkToTrader(trader)" class="subscribe light_link">
            Подробнее
          </nuxt-link>
        </div>

      </li>
    </ul>


  </div>
</template>


<script>

  import Emoji from '~/assets/js/emoji.json'
  import ttGraph from '~/components/ttGraph.vue'

  const API_SIGNALS_SERVICES = `/api/signals-services?include=comments,historypoints`

  export default {

    head() {
      return {
        title: 'Лучшие криптовалютные сигналы в Телеграм',
        meta: [
          { 
            hid: 'description', 
            name: 'description', 
            content: 'Обзор и отзывы о лучших торговых сигналах на Bitmex для биткоина, криптовалют и telegram каналов. Бесплатная информация для трейдеров.',
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
      } catch (e) {
      }

      return {
        services,
      }

    },

    components: {
      ttGraph,
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
      getFlag( litera ) {
        let flag = this.flags.find(el => el.aliases.includes(litera))
        return flag ? flag.emoji : this.flags[0].emoji
      },
      linkToTrader: function (trader) {
        return { path: '/traders/'+trader.id }
      },
      progress( value ) {
        return 'progress_' + Math.round(value * 20/300) * 5
      },

    }
  }

</script>