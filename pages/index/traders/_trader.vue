<template>
  <div class="ff_trader_page">

      <template class="ff_trader_item" v-for="trader of services">

        <div class="ff_trader_head">
          <div class="ff_trader_img_holder">
            <img v-if="trader.logo" class="trader_ava" :src="'/images/uploads/signal-services/logo/' + trader.logo" :alt="trader.name" >
          </div>
          <h1 class="ff_trader_title">
            {{ trader.name }}
          </h1>
        </div>

        <div v-if="trader.historypoints" class="tt_graph_wrap">
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

        <div v-else class="tt_graph_empty">
          <span class="trader_alert"></span>Подтвержденные данные торгов не предоставлены
        </div>

        <div class="ff_trader_item_row trader_stats_block margin12">
          <div class="stats_item" :class="isEmpty(trader.periods_deals)">
            <div class="ff_label">
              Сроки сделок
            </div>
            <div class="trader_value">
              <span v-for="period of trader.periods_deals" >
                {{ period }}
              </span>
            </div>
          </div>

          <div class="stats_item" :class="isEmpty(trader.team)">
            <div class="ff_label">
              Команда
            </div>
            <div class="trader_value">
              {{ trader.team }}
            </div>
          </div>

          <div class="stats_item" :class="isEmpty(trader.country)">
            <div class="ff_label">
              Страна
            </div>
            <div class="trader_value">
              <span class="ff_trader_flag">{{ getFlag(trader.country) }}</span>
            </div>
          </div>

          <div class="stats_item" :class="isEmpty(false)">
            <div class="ff_label">
              Сигналы
            </div>
            <div class="trader_value">
              
            </div>
          </div>

          <div class="stats_item" :class="isEmpty(trader.lang)">
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
        </div>

        <div class="comments_wrap">
          <div class="comments">
            <div class="comments_head_block">
              <h2 class="comments_head">Отзывы ({{ trader.comments ? trader.comments.length : 0 }})</h2>
              <span class="ic_up"></span>
              <span class="up">{{ trader.comments ? countPositives : 0 }}</span>
              <span class="ic_down"></span>
              <span class="down">{{ trader.comments ? countNegatives : 0}}</span>
            </div>
            <comment v-for="comment of trader.comments" v-bind:key="comment.id" :comment="comment"></comment>
            <comment v-for="newComment of newComments" v-bind:key="newComment.id" :comment="newComment"></comment>
          </div>

          <div class="ff_form">
            <h2>Оставить отзыв</h2>
            <p class="ff_label">Поделитесь своим опытом, если вы пользовались сигналами этой команды</p>
            <form>
              <div class="checkbox_row">
                <div class="checkbox_container">
                  <input type="radio" id="positive" value="positive" v-model="picked">
                  <label class="checkmark positive" for="positive">Положительный</label>
                </div>
                <div class="checkbox_container">
                  <input type="radio" id="negative" value="negative" v-model="picked">
                  <label class="checkmark negative" for="negative">Отрицательный</label>
                </div>
              </div>

              <textarea name="comment" v-model="commentText" v-on:keyup.enter="sendComment()"></textarea>

              <button class="subscribe" type="button" v-on:click="sendComment()" :disabled="commentsButtonDisabled" >
                Оставить отзыв
              </button> 
            </form>
          </div>
        </div>

        <div v-if="trader.description && trader.description.length > 0" class="trader_description">
          <section 
            class="trader_about collapsed_text" 
            v-html="trader.description"
            >
          </section>
        </div>

      </template>

  </div>
</template>


<script>

  import Emoji from '~/assets/js/emoji.json'
  import Comment from '~/components/Comment.vue'
  import ttGraph from '~/components/ttGraph.vue'

  export default {

    head() {
      return {
        title: `Рейтинг сигналов, отзывы о ${this.name}`,
        meta: [
          { 
            hid: 'description', 
            name: 'description', 
            content: `Доходность торговых сигналов от ${this.name}, цена, промокод, подписка`,
          },
        ],
      }
    },

    data() {
      return {
        flags: Emoji,
        commentText: '',
        commentsSendProcess: false,
        newComments: [],
        picked: 'positive',

      }
    },

    components: {
      Comment,
      ttGraph,
    },

    async asyncData ({ app, params }) {
      let services
      let name
      try {
        let servicesResponse = await app.$axios.get(getUrl(params.trader))
        services = app.$dataFormatter.deserialize(servicesResponse.data)
        if( services && services.length > 0 ) {
          name = services[0].name
        }
      } catch (e) {
      }

      return {
        services,
        name
      }

    },

    mounted () {
      this.goto()
    },

    computed: {
      commentsButtonDisabled: function () {
        return this.commentText.length < 1 || this.commentsSendProcess === true;
      },
      countPositives: function () {
        return this.services[0].comments.filter(el => el.type == 'positive').length;
      },
      countNegatives: function () {
        return this.services[0].comments.filter(el => el.type == 'negative').length;
      },
    },

    methods: {
      goto( element ) {
        let scrollParent = this.getScrollParent()
        scrollParent.scrollTo(0, 0)
      },
      getScrollParent() {
        return this.$parent.$refs["scroll-container"]
      },
      getFlag( litera ) {
        let flag = this.flags.find(el => el.aliases.includes(litera))
        return flag ? flag.emoji : this.flags[0].emoji
      },
      progress( value ) {
        return 'progress_' + Math.round(value * 20/300) * 5
      },

      sendComment() {
        this.commentsSendProcess = true
        let self  = this
        this.$axios.post( `/api/signals-services/${this.services[0].id}/comment-add`, `SignalComments[comment]=${this.commentText}&SignalComments[type]=${this.picked}`)
            .then( ({ data }) => {
              let commentObj = self.$dataFormatter.deserialize( data )
              if(commentObj && commentObj.length > 0) {
                self.newComments.push(commentObj[0])
                self.commentsSendProcess = false
                self.commentText = ''
              }
            })
            .catch(function (error) {
              self.commentsSendProcess = false
            })
      },

      isEmpty( value ) {
        return {
          'is_empty': value == undefined || value == null || value == false
        }
      }

    }

  }

  function getUrl( id ) {
    return `/api/signals-services/${id}?include=comments,historypoints,user`
  }

</script>