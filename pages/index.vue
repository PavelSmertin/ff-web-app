<template>
  <div class="container-fluid">
    <div class="row">
      <div class="ff-toolbar col">
        <nuxt-link :to="{name: 'index'}" class="logo-link">
            <img src="/logo.svg" alt="" class="normal-logo">
        </nuxt-link>
      </div>
    </div>
 
    <div class="row ff-content">

<!--       <div class="ff-left-panel col-1">
        <div class="scroll-container">
          <div v-for="coin of coins" v-bind:key="coin.id" class="currency ff-label">
            {{coin.attributes.symbol}}
          </div>
        </div>
      </div> -->

      <div v-bind:class="{ content_float: seen }" class="ff-center-panel col-md-8">
        <div class="scroll-container">
          <nuxt-child :key="$route.params.id"/>
        </div>

        <nuxt-link v-if="$route.name == 'slug-id'" :to="{name: 'index'}" class="ff-close">
            <img src="/close.svg" />
        </nuxt-link>
        <button v-else  v-on:click="closeContent()" class="ff-close">
            <img src="/close.svg" />
        </button>
      </div>

      <div class="ff-right-panel col-12 col-md-4">
        <ul class="right_tabs">
          <li class="right_tab">
            <button v-on:click="seen = !seen">Bitcoin</button>
          </li>
        </ul>
        <div class="scroll-container">
          <div v-if="news && news.length" class="ff-news">

            <div v-for="newest of news" v-bind:key="newest.id" class="ff-news-row">
              <div class="ff-news-cell">
                <div class="row">
                  <div class="col">
                    <timeago :since="newest.attributes.create_dt" class="time-ago ff-label"></timeago>
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
                    <timeago :since="item.attributes.create_dt" class="time-ago ff-label"></timeago>
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

            <infinite-loading @infinite="infiniteHandler">
              <span slot="no-more">You've reached the end!</span>
              <span slot="no-results">You've reached the end!</span>
            </infinite-loading>

          </div> 
        </div>
      </div> 

    </div>

  </div>
  
</template>


<script>
  import axios from 'axios'
  import VueTimeago from 'vue-timeago'
  import Vue from 'vue'
  import InfiniteLoading from 'vue-infinite-loading/src/components/InfiniteLoading.vue'
  

  const api_news = 'https://api.ff.ru/v1/news';
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
          meta: {current_page: 1},
          list: [],
          coins: [],
          seen: false
        }
    },

    components: {
      VueTimeago,
      InfiniteLoading
    },

    beforeRouteEnter (to, from, next) {
      next(vm => {
        // Экземпляр компонента доступен как `vm`
        vm.seen = to.name == "slug-id";
      })
    },

    beforeRouteUpdate (to, from, next) {
      this.seen = to.name == "slug-id";
      next();
    },

    methods: {

      infiniteHandler($state) {
        axios.get(api_news, {
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
        this.seen = !this.seen;
      }

    }
  };

  Vue.use(VueTimeago, {
    name: 'timeago', // component name, `timeago` by default
    locale: 'ru-RU',
    locales: {
      // you will need json-loader in webpack 1
      'ru-RU': require('@/assets/locales/ru-RU.json')
    }
  })

</script>