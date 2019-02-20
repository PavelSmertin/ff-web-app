<template>
  <div class="ff_trader_page">


      <template class="ff_trader_item" v-for="trader of services">

        <div class="ff_trader_head">
          <img v-if="trader.logo" class="trader_ava" :src="'/images/uploads/signal-services/logo/' + trader.logo" :alt="trader.name" >
          <h1 class="ff_trader_title">
            {{ trader.name }}
          </h1>
        </div>

        <div class="ff_trader_item_row trader_ratings_block">
          <div class="stats_item">
            <div class="ff_label">
              Рейтинг
            </div>
            <div class="pie-wrapper" :class="progress(trader.rating_common)">
              <span class="label">{{ trader.rating_common ? trader.rating_common : '-' }}</span>
              <div class="pie">
                <div class="left-side half-circle"></div>
                <div class="right-side half-circle"></div>
              </div>
              <div class="shadow"></div>
            </div>
          </div>
          <div class="stats_item">
            <div class="ff_label">
              Доходность
            </div>
            <div class="pie-wrapper" :class="progress(trader.rating_profit)">
              <span class="label">{{ trader.rating_profit ? trader.rating_profit : '-' }}</span>
              <div class="pie">
                <div class="left-side half-circle"></div>
                <div class="right-side half-circle"></div>
              </div>
              <div class="shadow"></div>
            </div>
          </div>
          <div class="stats_item">
            <div class="ff_label">
              Точность
            </div>
            <div class="pie-wrapper" :class="progress(trader.rating_accuracy)">
              <span class="label">{{ trader.rating_accuracy ? trader.rating_accuracy : '-' }}</span>
              <div class="pie">
                <div class="left-side half-circle"></div>
                <div class="right-side half-circle"></div>
              </div>
              <div class="shadow"></div>
            </div>
          </div>
          <div class="stats_item">
            <div class="ff_label">
              Цена
            </div>
            <div class="pie-wrapper" :class="progress(trader.rating_price)">
              <span class="label">{{ trader.rating_price ? trader.rating_price : '-' }}</span>
              <div class="pie">
                <div class="left-side half-circle"></div>
                <div class="right-side half-circle"></div>
              </div>
              <div class="shadow"></div>
            </div>
          </div>
          <div class="stats_item">
            <div class="ff_label">
              Поддержка
            </div>
            <div class="pie-wrapper" :class="progress(trader.rating_support)">
              <span class="label">{{ trader.rating_support ? trader.rating_support : '-' }}</span>
              <div class="pie">
                <div class="left-side half-circle"></div>
                <div class="right-side half-circle"></div>
              </div>
              <div class="shadow"></div>
            </div>
          </div>
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

        <div class="comments_wrap">
          <div class="comments">
            <h2 class="comments_head">Отзывы</h2>
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

        <div v-if="trader.description && trader.description.length > 0" class="trader_description collapsed_text_wrap" :ref="'coolpased_text_'+trader.id">
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

      </template>

  </div>
</template>


<script>

  import Emoji from '~/assets/js/emoji.json'
  import Comment from '~/components/Comment.vue'

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
        commentText: '',
        commentsSendProcess: false,
        newComments: [],
        picked: 'positive',

      }
    },

    components: {
      Comment,
    },

    async asyncData ({ app, params }) {
      let services
      try {
        let servicesResponse = await app.$axios.get(getUrl(params.trader))
        services = app.$dataFormatter.deserialize(servicesResponse.data)
      } catch (e) {
      }

      return {
        services,
      }

    },

    computed: {
      commentsButtonDisabled: function () {
        return this.commentText.length < 1 || this.commentsSendProcess === true;
      },

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
      },
      progress( value ) {
        return 'progress_' + Math.round(value * 20/300) * 5
      },

      sendComment() {
        this.commentsSendProcess = true
        let self  = this
        this.$axios.post( `/api/signals-services/${this.services[0].id}/comment-add`, `SignalComments[comment]=${this.commentText}&SignalComments[type]=positive`)
            .then( ({ data }) => {
              let commentObj = self.$dataFormatter.deserialize( data )
              self.newComments.push(commentObj)
              self.commentsSendProcess = false
              self.commentText = ''
            })
            .catch(function (error) {
              self.commentsSendProcess = false
            })
      },

    }

  }

  function getUrl( id ) {
    return `/api/signals-services/${id}?include=comments,historypoints,user`
  }

</script>