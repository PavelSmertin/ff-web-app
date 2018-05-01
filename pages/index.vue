<template>
  <div class="container-fluid">
    <div class="row">
      <div class="ff-toolbar col">
        <a href="/" class="logo-link">
          <img src="/logo.svg" alt="" class="normal-logo"> 
        </a>
      </div>
    </div>
 
    <div class="row ff-content">

      <div class="ff-left-panel col-1">
        <div class="scroll-container">
          <div v-for="coin of coins" v-bind:key="coin.id" class="currency ff-label">
            {{coin.attributes.symbol}}
          </div>
        </div>
      </div>

      <div class="ff-center-panel col-7">
        <div class="scroll-container">
          <nuxt-child :key="$route.params.id"/>
        </div>
      </div>

      <div class="ff-right-panel col">
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
                    <nuxt-link :to="{ 
                              name: 'slug-id', 
                              params: { 
                                  id: newest.id, 
                                  slug: newest.attributes.slug, 
                                  newest:  newest.attributes }}"
                              class="ff-nc-title">
                        {{newest.attributes.title}}
                    </nuxt-link>
                  </div>
                </div>
              </div>
              <nuxt-link :to="{ 
                        name: 'slug-id', 
                        params: { 
                            id: newest.id, 
                            slug: newest.attributes.slug, 
                            newest:  newest.attributes }}" 
                        class="click-area">
                          
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
                    <nuxt-link :to="{ 
                        name: 'slug-id', 
                        params: { 
                            id: item.id, 
                            slug: item.attributes.slug, 
                            newest:  item.attributes }}" 
                        class="ff-nc-title">
                      {{item.attributes.title}}
                    </nuxt-link>
                  </div>
                </div>
              </div>
              <nuxt-link :to="{ 
                        name: 'slug-id', 
                        params: { 
                            id: item.id, 
                            slug: item.attributes.slug, 
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
          meta : {current_page: 1},
          list : [],
          coins : []
        }
    },

    components: {
      VueTimeago,
      InfiniteLoading
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
    }
  }

  Vue.use(VueTimeago, {
    name: 'timeago', // component name, `timeago` by default
    locale: 'ru-RU',
    locales: {
      // you will need json-loader in webpack 1
      'ru-RU': require('@/assets/locales/ru-RU.json')
    }
  })

</script>