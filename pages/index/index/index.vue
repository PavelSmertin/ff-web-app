<template>
  <div class="index_pane">

    <div class="margin12 content_padding" v-if="$store.state.indexPopular.length">
      <h2 class="margin12">Популярное</h2>
        <div class="ff_news ff_popular">
          <nuxt-link @click.native="onPostClick(newest.id)" v-for="(newest, index) in $store.state.indexPopular" v-bind:key="newest.id" :to="linkToPost(newest)" class="ff_news_row">
            <post-item :post="newest" :isFirst="{ true : index === 0 }" ></post-item>
          </nuxt-link>
        </div>
    </div>

    <div class="tt_graph_wrap margin24">
      <div class="filters">
        <ttFilters :label="'период'" :options="intervalOptions" :selectedProp="$store.state.graphFilters.period"  v-on:updateOption="filter($event, 'period')" />
      </div>

      <div class="tt_graph_head content_padding">
        <h2>Доля Bitcoin в портфелях трейдеров</h2>
        <a href="https://tt.ff.ru" rel="noopener" target="_blank" class="button_tt_link">Узнать больше</a>
      </div>

      <ttGraph
          class="border_top tt_graph"
          :first="{color: '#8FCC14', gradient: 'GradientFirst', opacity: 1 }" 
          :second="{color: '#000', gradient: 'GradientSecond', opacity: 0.2 }"
          :interactive="true"
          :mainCoin="true"
      />
      <div v-if="$store.state.filterLoading" class="loading"></div>
    </div>

    <div class="border_top content_padding">
      <h2 class="margin12">Биткойн калькулятор</h2>
    </div>
    <div class="calculator margin6 content_padding">
      <div class="calculator_item">
        <label class="label"><img src="~/assets/images/btc_icon_white.png" width="20" height="20" alt="btc_icon"><span class="label_currency">BTC</span></label>
        <input type="text" name="btc" v-model="calculateBTC" autocomplete="off"  v-on:keypress="isNumber" @focus="$event.target.select()" @mouseup="calcSafaryHack" >
      </div>
      <div class="calculator_item">
        <label class="label"><img src="~/assets/images/usd_icon.svg" alt="usd_icon"><span class="label_currency">USD</span></label>
        <input type="text" name="usd" v-model="calculateUSD" autocomplete="off"  v-on:keypress="isNumber" @focus="$event.target.select()" @mouseup="calcSafaryHack">
      </div>
      <div class="calculator_item">
        <label class="label"><img src="~/assets/images/rub_icon.svg" alt="rub_icon"><span class="label_currency">RUB</span></label>
        <input type="text" name="rub" v-model="calculateRUB" autocomplete="off"  v-on:keypress="isNumber" @focus="$event.target.select()" @mouseup="calcSafaryHack">
      </div>
      <div class="calculator_item">
        <nuxt-link @click.native="sendEvent('BuyBTC', 'click')" :to="{path: '/wiki/1'}">
          <span class="apply">КУПИТЬ BTC</span>
          <img src="~/assets/images/baseline-arrow_forward-24px.svg" alt="arrow">
        </nuxt-link >
      </div>
    </div>

    <div class="border_top margin24 content_padding">
      <h3 class="margin12">Полезная информация</h3>
    </div>

    <div class="margin6 wiki_block content_padding">
      <nuxt-link @click.native="onWikiClick(1)" class="wiki_item" :to="{ path: '/wiki/1' }">
        <p class="wiki_title">Как купить биткоин?</p>
        <p class="wiki_description">Инструкция: как купить биткоин онлайн надежно с карты за рубли, доллары или через электронные кошельки QIWI, Webmoney</p>
      </nuxt-link>
      <nuxt-link @click.native="onWikiClick(2)" class="wiki_item" :to="{ path: '/wiki/2' }">
        <p class="wiki_title">Где хранить биткоины?</p>
        <p class="wiki_description">Важно выбрать наиболее надежный и удобный способ хранения биткоина, для этого подойдут Bitcoin кошельки. Существует несколько типов кошельков, разберемся какой лучше</p>
      </nuxt-link>        
      <nuxt-link @click.native="onWikiClick(3)" class="wiki_item" :to="{ path: '/wiki/3' }">
        <p class="wiki_title">Что такое блокчейн?</p>
        <p class="wiki_description">BlockChain (англ. Block – блок; Chain - цепь) - это база данных, которая ежедневно пополняется информацией о криптовалютных переводах между пользователями</p>
      </nuxt-link>
      <nuxt-link @click.native="onWikiClick(4)"  class="wiki_item" :to="{ path: '/wiki/4' }">
        <p class="wiki_title">Как продать биткоин?</p>
        <p class="wiki_description">Продать или обналичить биткоины можно нескольким способами, например через биржи, обменники или с помощью карты</p>
      </nuxt-link>
      <nuxt-link @click.native="onWikiClick(5)" class="wiki_item" :to="{ path: '/wiki/5' }">
        <p class="wiki_title">Биткоин в России</p>
        <p class="wiki_description">Биткоин в России использовать можно, отношение государства к криптовалюте на данный момент носит неопределенный характер</p>
      </nuxt-link>
      <nuxt-link @click.native="onWikiClick(6)" class="wiki_item" :to="{ path: '/wiki/6' }">
        <p class="wiki_title">Что такое Биткоин?</p>
        <p class="wiki_description">Биткоин - первая криптовалюта, ставшая всемирно-известной в 2017 году. Основная суть биткоина состоит в децентрализации</p>
      </nuxt-link>
    </div>

    <div class="index_text_wrap">
      <section 
        v-if="$store.state.indexDetails.seo_text" 
        class="ff_text_block" 
        v-html="$store.state.indexDetails.seo_text" 
        v-bind:class="indexSeoText"
        >
      </section>
      <button 
        class="button_class seo_text_toggle" 
        v-on:click.stop.prevent="toggleSeoText()" 
        v-bind:class="indexSeoText" 
        v-html="toggleSeoAction"
        >
      </button>
    </div>

  </div>
</template>


<script>
  import PostItem from '~/components/PostItem.vue'
  import ttGraph from '~/components/ttGraph.vue'
  import ttFilters from '~/components/ttFilters.vue'

  import { analMixin } from '~/components/mixins/analitics.js'
  import { coinsMixin } from '~/components/mixins/coins.js'

  import _ from 'lodash'

  const REQUEST_GRAPH = `/api/portfolios/coin-graph/`

  export default {

    mixins: [ analMixin, coinsMixin ],

    data() {
      return {
        calculatorBTC: 1,
        calculatorUSD: this.$store.state.indexDetails.price_usd,
        calculatorRUB: this.$store.state.indexDetails.price_rub,
        seoTextCollapsed: true,
        intervalOptions: [
          { name: 'Сутки', value: '1d' },
          { name: 'Неделя', value: '1w' },
          { name: 'Месяц', value: '1m' },
        ],

      }
    },

    components: {
      PostItem,
      ttGraph,
      ttFilters,
    },

    mounted () {
      if( this.$store.state.graphs['BTC'] == undefined ) {
        this.retrieveGraph()
      }
    },

    methods: {
      formatCalculator(value, percision = 2) {
        let val = (value/1).toFixed(percision)
        return val.toString()
      },
      isNumber: function(evt) {
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
          evt.preventDefault();;
        } else {
          return true;
        }
      },
      calcSafaryHack: function (event) {
        event.preventDefault();
      },
      onWikiClick: function ( wikiPage ) {
        this.sendEvent( 'BTCWiki', 'click', wikiPage );
      },
      linkToPost: function (post) {
        if( post.slug ) {
          return { name: 'slug-id', params: { id: post.id, slug: post.slug, newest:  post, }}
        } else {
          return { name: 'index-symbol-id', params: { 
              symbol: this.$route.params.symbol ? this.$route.params.symbol : 'btc',
              id: post.id, 
              newest:  post,
            }
          }

        }
      },
      onPostClick: function ( postId ) {
        this.sendEvent( 'PopularNews', 'click', postId );
      },
      async retrieveGraph () {
        try {
          const data = await this.$axios.get(requestGraph( 'BTC', this.$store.state.graphFilters ))
          this.$store.commit( 'SET_GRAPH', {symbol: 'BTC', data: data.data['BTC']} )
        } catch( e ) {
          if( process.env.NODE_ENV == 'development' ) {
            console.error(e)
          }
        }
      },
      filter ( filter, type ) {
        this.$store.commit( 'SET_GRAPH_FILTER', { type: type, value: filter.value } )
      },
      toggleSeoText () {
        this.seoTextCollapsed = !this.seoTextCollapsed
      },
    },

    computed: {
      calculateBTC: {
        get: function () {
          return this.calculatorBTC
        },
        set: function( value ) {
          value = value.toString().replace(",", ".")
          this.calculatorBTC = value
          this.calculatorUSD = value ? this.formatCalculator( value * this.$store.state.indexDetails.price_usd, 2 ) : ''
          this.calculatorRUB = value ? this.formatCalculator( value * this.$store.state.indexDetails.price_rub, 2 ) : ''
        }
      },
      calculateUSD: {
        get: function () {
          return this.calculatorUSD
        },
        set: function( value ) {
          value = value.toString().replace(",", ".")
          this.calculatorBTC = value ? this.formatCalculator( value / this.$store.state.indexDetails.price_usd, 6 ) : ''
          this.calculatorUSD = value
          this.calculatorRUB = value ? this.formatCalculator( this.$store.state.indexDetails.price_rub * value / this.$store.state.indexDetails.price_usd, 2 ) : ''
        }
      },
      calculateRUB: {
        get: function () {
          return this.calculatorRUB
        },
        set: function( value ) {
          value = value.toString().replace(",", ".")
          this.calculatorBTC = value ? this.formatCalculator( value / this.$store.state.indexDetails.price_rub, 6 ) : ''
          this.calculatorUSD = value ? this.formatCalculator( this.$store.state.indexDetails.price_usd * value / this.$store.state.indexDetails.price_rub, 2 ) : ''
          this.calculatorRUB = value
        }
      },
      indexSeoText: function () {
        return {
          'ff_text_collapased' : this.seoTextCollapsed,
          'ff_text_expanded' : !this.seoTextCollapsed,
        }      
      },
      toggleSeoAction: function () {
          return this.seoTextCollapsed ? 'Развернуть <span>&#9660;</span>' : 'Свернуть <span>&#9650;</span>'
      },
    },

    watch: {
      '$store.state.graphFilters': {
        handler: _.debounce( async function ( newValue ) {
          await this.retrieveGraph()
          this.$store.commit( 'TERMINATE_GRAPH_FILTER_LOADING' )
        }, 100 ),
        deep: true
      },
    },

  }

  function requestGraph( symbol, filters ) {
    let filterQuery = 
          ( filters.cap ? '?cap=' + filters.cap : '' ) + 
          ( filters.period ? '&period=' + filters.period : '' ) +
          ( filters.profit ? '&profit=' + filters.profit : '' )
    return REQUEST_GRAPH + symbol +  filterQuery
  }

</script>