<template>
  <div class="container-fluid p-0">


    <header class="row no-gutters">
      <div class="ff-toolbar col">
        <nuxt-link :to="{name: 'index'}" class="logo-link">
            <img src="/logo.svg" alt="" class="normal-logo">
        </nuxt-link>
      </div>
    </header>
 
    <div class="row ff-content no-gutters">

<!--       <div class="ff-left-panel col-1">
        <div class="scroll-container">
          <div v-for="coin of coins" v-bind:key="coin.id" class="currency ff-label">
            {{coin.attributes.symbol}}
          </div>
        </div>
      </div> -->

      <main v-bind:class="{ content_float: seenIndex || seenPost, content_post: seenPost}" class="ff-center-panel col-md-8">
        <div class="scroll-container">
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
                      <li v-if="newest.attributes.time_for_translation" v-html="translationTime(newest.attributes.time_for_translation)"></li>
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

            <div v-for="(item, key) in list" v-bind:key="key" class="ff-news-row">
              <div class="ff-news-cell">

                <div class="row">
                  <div class="col">
                    <ul class="ff-label news_list_detail">
                      <li><timeago :since="item.attributes.create_dt" class="time-ago"></timeago></li>
                      <li v-if="item.attributes.time_for_translation" v-html="translationTime(item.attributes.time_for_translation)"></li>
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

            <infinite-loading @infinite="infiniteHandler" spinner="spiral">
              <span slot="no-more">You've reached the end!</span>
              <span slot="no-results">You've reached the end!</span>
            </infinite-loading>

          </div> 
        </div>
      </aside>

    </div>

    <footer class="ff-footer row justify-content-between" >
      <div class="d-none d-md-block col-md-8 ff-label"><span>Copyright &copy; FF.ru</span></div>


      <div class="social col-12 col-md-4">
        <a href="https://vk.com/cryptoff" class="social_link vk" target="_blank"></a>
        <a href="https://t.me/ff_ru" class="social_link tg" target="_blank"></a>
        <a href="https://twitter.com/www_FF_ru" class="social_link tr" target="_blank"></a>
        <a href="https://fb.com/crypto.ff.ru/" class="social_link fb" target="_blank"></a>
      </div>

    </footer>

  </div>
  
</template>


<script>
  import axios from 'axios'
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

    async asyncData({ params, error }) {
      try {
        let [news, coins] = await Promise.all([
          axios.get(api_news),
          axios.get(api_coins),
        ])
        return { news: news.data.data, coins: coins.data.data }
      } catch (e) {
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
        vm.seenPost = to.name == "slug-id";
      })
    },

    beforeRouteUpdate (to, from, next) {
      this.seenPost = to.name == "slug-id";
      next();
    },

    methods: {

      infiniteHandler($state) {
        this.infiniteState = $state
        axios.get(this.apiNewsPrepared, {
          params: {
            page: this.meta.current_page + 1,
          },
        }).then(({ data }) => {
          console.log(data.meta.page_count)
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

      translationTime: function translationTime(seconds) {
        var ret =
          seconds <= MINUTE
              ? pluralOrSingular(seconds, 'сек')
              : seconds < HOUR
                ? pluralOrSingular(seconds / MINUTE, 'мин')
                : seconds < DAY
                  ? pluralOrSingular(seconds / HOUR, 'ч')
                  : seconds < WEEK
                    ? pluralOrSingular(seconds / DAY, 'д')
                    : seconds < MONTH
                      ? pluralOrSingular(seconds / WEEK, 'н')
                      : seconds < YEAR
                        ? pluralOrSingular(seconds / MONTH, 'мес')
                        : pluralOrSingular(seconds / YEAR, 'г');

        return ret
      },

      methodToRunOnSelect(payload) {
        if(this.infiniteState) { 
          this.infiniteState.reset()
        }
        this.object = payload
        this.apiNewsPrepared = api_news + (payload.value ? '?filter[type]=' + payload.value : '')
        let data = axios.get(this.apiNewsPrepared).then(({ data }) => {
          this.news = data.data
          this.list = []
          this.meta = {current_page: 1}
        });
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

  function pluralOrSingular(data, locale) {
    var count = Math.round(data);
    return 'Перевод: ' + count + ' ' + locale;
  }



</script>