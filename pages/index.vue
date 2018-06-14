<template> 
  <div class="row ff-content no-gutters">

    <div class="ff-left-panel col-md-1">
      <div class="scroll-container">
        <div v-for="coin of coins" v-bind:key="coin.id" class="currency ff-label">
          <nuxt-link :to="{ name: 'index-symbol',  params: { symbol: downSymbol(coin.attributes.symbol) }}" >
              {{coin.attributes.symbol}}
          </nuxt-link>
          <nuxt-link :to="{ name: 'index-symbol',  params: { symbol: downSymbol(coin.attributes.symbol) }}" class="click-area">
          </nuxt-link>
        </div>
      </div>
    </div>

    <main v-bind:class="{ content_float: seenIndex || seenPost, content_post: seenPost}" class="ff-center-panel col-md-7">
      <div class="scroll-container" ref="scroll-container">
        <nuxt-child :key="$route.params.id"/>
      </div>
      <nuxt-link v-if="seenPost" v-on:click="closeContent()" :to="{name: 'index'}" class="ff-close">
          <img src="/close.svg" />
      </nuxt-link>
    </main>

    <aside class="ff-right-panel col-12 col-md-4">

      <ul class="right_tabs">
        <li  v-on:click="seenIndex = true" class="right_tab">
          <span v-bind:class="{ active_tab: seenIndex }">Bitcoin</span>
        </li>
        <li v-on:click="seenIndex = false" class="right_tab">
          <span v-bind:class="{ active_tab: !seenIndex }">Новости</span>
        </li>
      </ul>

      <dropdowns :options="arrayOfObjects" :selected="object" v-on:updateOption="methodToRunOnSelect"></dropdowns>

      <div class="scroll-container">
        <div v-if="news && news.length" class="ff-news">

          <div v-for="newest of news" v-bind:key="newest.id" class="ff-news-row">
            <div class="ff-news-cell">
              <div class="row">
                <div class="col">
                  <ul class="ff-label news_list_detail">
                    <li><timeago :since="newest.attributes.create_dt" class="time-ago"></timeago></li>
                    <li v-if="newest.attributes.type == 'news'">Новость</li>
                    <li v-else-if="newest.attributes.type == 'prognosis'">Прогноз</li>
                  </ul>
                </div>
              </div>

              <div class="row">
                <div class="col">
                  <nuxt-link v-if="newest.attributes.slug" :to="{ 
                            name: 'slug-id', 
                            params: { 
                                id: newest.id, 
                                slug: newest.attributes.slug, 
                                newest:  newest.attributes }}"
                            class="ff-nc-title"
                            >
                      {{newest.attributes.title}}
                  </nuxt-link>

                  <nuxt-link v-else :to="{ 
                            name: 'index-id', 
                            params: { 
                                id: newest.id,
                                newest:  newest.attributes }}"
                            class="ff-nc-title"
                            >
                      {{newest.attributes.title}}
                  </nuxt-link>
                </div>
              </div>

              <nuxt-link v-if="newest.attributes.slug" :to="{ 
                        name: 'slug-id', 
                        params: { 
                            id: newest.id, 
                            slug: newest.attributes.slug, 
                            newest:  newest.attributes }}" 
                        class="click-area"
                        >
              </nuxt-link>
              <nuxt-link v-else :to="{ 
                        name: 'index-id', 
                        params: { 
                            id: newest.id,
                            newest:  newest.attributes }}" 
                        class="click-area"
                        >
              </nuxt-link>
            </div>
          </div>
        </div>

        <div v-for="(item, key) in list" v-bind:key="key" class="ff-news-row">
          <div class="ff-news-cell">

            <div class="row">
              <div class="col">
                <ul class="ff-label news_list_detail">
                  <li><timeago :since="item.attributes.create_dt" class="time-ago"></timeago></li>
                  <li v-if="item.attributes.type == 'news'">Новость</li>
                  <li v-else-if="item.attributes.type == 'prognosis'">Прогноз</li>
                </ul>

              </div>
            </div>

            <div class="row">
              <div class="col">
                <nuxt-link v-if="item.attributes.slug"  :to="{ 
                    name: 'slug-id', 
                    params: { 
                        id: item.id, 
                        slug: item.attributes.slug, 
                        newest:  item.attributes }}" 
                    class="ff-nc-title">
                  {{item.attributes.title}}
                </nuxt-link>
                <nuxt-link v-else  :to="{ 
                    name: 'index-id', 
                    params: { 
                        id: item.id,
                        newest:  item.attributes }}" 
                    class="ff-nc-title">
                  {{item.attributes.title}}
                </nuxt-link>
              </div>
            </div>
            <nuxt-link v-if="item.attributes.slug"  :to="{ 
                      name: 'slug-id', 
                      params: { 
                          id: item.id, 
                          slug: item.attributes.slug, 
                          newest:  item.attributes }}" 
                      class="click-area">
            </nuxt-link>
            <nuxt-link v-else  :to="{ 
                      name: 'index-id', 
                      params: { 
                          id: item.id,
                          newest:  item.attributes }}" 
                      class="click-area">
            </nuxt-link>
          </div>
        </div>

        <infinite-loading @infinite="infiniteHandler" spinner="spiral">
          <span slot="no-more">You've reached the end!</span>
          <span slot="no-results">You've reached the end!</span>
        </infinite-loading>
      </div> 
    </aside>

  </div>
</template>


<script>
  import VueTimeago from 'vue-timeago'
  import Dropdowns from '~/components/Dropdowns.vue'
  import Vue from 'vue'
  import InfiniteLoading from 'vue-infinite-loading/src/components/InfiniteLoading.vue'

  var MINUTE = 60;
  var HOUR = MINUTE * 60;
  var DAY = HOUR * 24;
  var WEEK = DAY * 7;
  var MONTH = DAY * 30;
  var YEAR = DAY * 365;

  const api_news = 'https://api.ff.ru/v1/news/';
  const api_coins = 'https://api.ff.ru/v1/coin/index?fields[portfolio-coins]=symbol,full_name,price_usd,percent_change24h';

  export default {

    async asyncData({ app, params, error }) {

      var apiNewsFiltered = api_news
      if( params.symbol ) {
        //apiNewsFiltered = filterBySymbol(params.symbol)
      }

      try {
        let [news, coins] = await Promise.all([
          app.$axios.get(apiNewsFiltered),
          app.$axios.get(api_coins),
        ])
        return { news: news.data.data, coins: coins.data.data }
      } catch (e) {
        console.log(e);

        error({ message: 'News not found', statusCode: 404 })
      }
    },

    data() {
      return {
        infiniteState: null,
        meta: {current_page: 1},
        list: [],
        coins: [],
        seenPost: false,
        seenIndex: true,
        showSelect: false,
        arrayOfObjects: [
          { name: 'Все новости' }, 
          { name: 'Новость', value: 'news' },
          { name: 'Прогноз', value: 'prognosis' }
        ],
        object: {
          name: 'Все новости',
        },
        apiNewsPrepared: api_news

      }
    },

    // fetch ({ store }) {
    //   return Promise.all([
    //       axios.get(api_news),
    //       axios.get(api_coins),
    //   ])
    //   .then((res) => {
    //     console.log('news retrieved');

    //     this.news = res[0].data.data;
    //   })
    // },

    components: {
      VueTimeago,
      InfiniteLoading,
      Dropdowns
    },

    mounted () {
      this.showSelect = true // showLine will only be set to true on the client. This keeps the DOM-tree in sync.
    },

    beforeRouteEnter (to, from, next) {
      next(vm => {
        // Экземпляр компонента доступен как `vm`
        console.log('beforeRouteEnter: ' + to.name)
        vm.seenPost = to.name == "slug-id";
      })
    },

    beforeRouteUpdate (to, from, next) {
      console.log('beforeRouteUpdate: ' + to.name)
      this.seenPost = to.name == "slug-id";
      next();
    },

    methods: {

      infiniteHandler($state) {
        this.infiniteState = $state
        this.$axios.get(this.apiNewsPrepared, {
          params: {
            page: this.meta.current_page + 1,
          },
        }).then(({ data }) => {
          if (this.meta.current_page < data.meta.page_count) {
            this.meta = data.meta
            this.list = this.list.concat(data.data)
            $state.loaded()
          } else {
            $state.complete()
          }
        });
      }, 
      closeContent() {
        this.seenIndex = false;
      },

      methodToRunOnSelect(payload) {
        if(this.infiniteState) { 
          this.infiniteState.reset()
        }
        this.object = payload
        this.apiNewsPrepared = api_news + (payload.value ? '?filters[news-translated][type]=' + payload.value : '')
        let data = this.$axios.get(this.apiNewsPrepared).then(({ data }) => {
          this.news = data.data
          this.list = []
          this.meta = {current_page: 1}
        });
      },

      filterBySymbol(symbol) {
        if(this.infiniteState) { 
          this.infiniteState.reset()
        }
        this.object = payload
        this.apiNewsPrepared = api_news + (payload.value ? '?filter[type,]=' + symbol : '')
        let data = this.$axios.get(this.apiNewsPrepared).then(({ data }) => {
          this.news = data.data
          this.list = []
          this.meta = {current_page: 1}
        });
      },

      downSymbol(value) {
        return value.toLowerCase()
      }

    },

    // computed: {
    //   news: {
    //     get () {
    //       console.log('news get')
    //       return this.$store.state.news
    //     },
    //     set (value) {
    //       console.log('news set');
    //       this.$store.commit('setNews', value)
    //     }
    //   }
    // }


  };

  Vue.use(VueTimeago, {
    name: 'timeago', // component name, `timeago` by default
    locale: 'ru-RU',
    locales: {
      // you will need json-loader in webpack 1
      'ru-RU': require('@/assets/locales/ru-RU.json')
    }
  });

</script>