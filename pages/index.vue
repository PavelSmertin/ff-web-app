<template>
  <div class="ff-layout">
    <div class="ff-left-panel ff-panel">
      <a href="" class="logo-link">
        <img src="/logo77.png" alt="" class="normal-logo" width="77" height="77"> 
        <img src="/logo77.png" alt="" class="mobile-logo" width="77" height="77">
      </a>
    </div>
    <div class="ff-center-panel">
        <div class="ff-container">
          <div class="ff-content-panels">
            <div class="ff-main-panel">
              <div class="pane-toolbar left-pane-toolbar">
                <div class="dropdown-filters">
                  <div class="dropdown-filter">
                    <div class="filter-name">
                      <span>Top News</span>
                      <span class="icon icon-caret-down-two"></span>
                    </div>
                    <div class="filter-content filter-menu">
                      <a href="/" class="menu-link router-link-exact-active router-link-active router-link-exact-active">Top News</a>
                      <a href="/news/all" class="menu-link">All News</a>
                      <a href="/news/news-sites" class="menu-link">News Sites</a>
                      <a href="/news/following" class="menu-link">Following</a>
                      <div class="menu-link menu-parent">Category
                        <span class="icon icon-caret-right"></span>
                        <div class="filter-menu filter-content filter-sub-menu">
                          <a href="/news/price-analysis" class="menu-link">Price Analysis</a><a href="/news/regulation" class="menu-link">Regulation</a>
                          <a href="/news/ico-news" class="menu-link">ICO News</a>
                          <a href="/news/events" class="menu-link">Events</a>
                        </div>
                      </div>
                    </div>
                  </div> 
                  <div class="dropdown-filter">
                    <div class="filter-name">
                      <span>Show All</span>
                      <span class="icon icon-caret-down-two"></span>
                    </div> 
                    <div class="filter-content filter-menu">
                      <a href="/" class="menu-link router-link-exact-active router-link-active router-link-exact-active">Show all</a> 
                      <a href="/news?filter=hot" class="menu-link">Hot!</a> 
                      <a href="/news?filter=trending" class="menu-link">Trending</a> 
                      <a href="/news?filter=bullish" class="menu-link">Bullish</a>
                      <a href="/news?filter=bearish" class="menu-link">Bearish</a> 
                      <a href="/news?filter=important" class="menu-link">Important</a>
                      <a href="/news?filter=lol" class="menu-link">LOL</a>
                      <a href="/news?filter=saved" class="menu-link">Saved</a> 
                    </div>
                  </div>
                </div>
                <div class="search-container">
                  <div autocomplete="off" class="ac-search-container">
                    <input type="text" name="q" autocomplete="off" placeholder="Search..." class="form-control"> <!----></div>
                    <span class="icon icon-times" style="display: none;"></span>
                </div>
                <a href="" class="show-sidebar-icon">
                  <span class="icon icon-cog"></span>
                </a>
              </div>
              <div class="news-container">
                <div v-if="news && news.length" class="news">
                  <div v-for="newest of news" v-bind:key="newest.id" class="news-row">
                    <div class="news-cells">

                      <nuxt-link :to="{ path: '/' + newest.id + (newest.attributes.slug ? '/' + newest.attributes.slug : ''), params: { newest: newest.attributes }}" 
                                  class="news-cell nc-date">
                        <timeago :since="newest.attributes.create_dt"></timeago>
                      </nuxt-link>

                      <nuxt-link :to="{ path: '/' + newest.id + (newest.attributes.slug ? '/' + newest.attributes.slug : ''), params: { newest: newest.attributes }}" 
                                  class="news-cell nc-title">
                        <span class="title-text">
                          <span>{{newest.attributes.title}}</span>
                          <span class="si-source-name">
                            <span class="open-link-icon icon icon-link"></span>
<!--                             <span class="si-source-domain">r/bitcoin</span>
 -->                          </span>
                        </span>
                      </nuxt-link>

                      <div class="news-cell nc-currency">
<!--                         <a href="/news/bitcoin/" class="colored-link">BTC</a>
 -->                      </div>
                    </div>
                      <nuxt-link :to="{ path: '/' + newest.id + (newest.attributes.slug ? '/' + newest.attributes.slug : ''), params: { newest: newest.attributes }}" 
                    class="click-area">
                      
                    </nuxt-link>
                  </div>

                  <div class="news-row" v-for="(item, key) in list" v-bind:key="key">
                    <div class="news-cells">

                      <nuxt-link :to="{ path: '/' + item.id + (item.attributes.slug ? '/' + item.attributes.slug : ''), params: { newest: item.attributes }}" 
                                class="news-cell nc-date">
                        <timeago :since="item.attributes.create_dt"></timeago>
                      </nuxt-link>

                      <nuxt-link :to="{ path: '/' + item.id + (item.attributes.slug ? '/' + item.attributes.slug : ''), params: { newest: item.attributes }}" 
                                class="news-cell nc-title">
                        <span class="title-text">
                          <span>{{item.attributes.title}}</span>
                          <span class="si-source-name">
                            <span class="open-link-icon icon icon-link"></span>
<!--                             <span class="si-source-domain">r/bitcoin</span>
 -->                          </span>
                        </span>
                      </nuxt-link>

                      <div class="news-cell nc-currency">
<!--                         <a href="/news/bitcoin/" class="colored-link">BTC</a>
 -->                      </div>
                    </div>
                      <nuxt-link :to="{ path: '/' + item.id + (item.attributes.slug ? '/' + item.attributes.slug : ''), params: { newest: item.attributes }}" 
                              class="click-area">
                      
                    </nuxt-link>
                  </div>
                  <infinite-loading @infinite="infiniteHandler">
                    <span slot="no-more">You've reached the end!</span>
                    <span slot="no-results">You've reached the end!</span>
                  </infinite-loading>
                </div> 


              </div> 
              <div class="loader loader-sm ff-loader news-loader" style="display: none;"></div>
            </div> 

            <div class="ff-sec-pane">
              <nuxt-child :key="$route.params.id"/>
            </div>

          </div>
        </div> 
        <div class="ff-footer">
          <div class="social">
          </div>
        </div> 
        <nav class="mobile-nav">
          <a href="javascipt:;" class="close-menu menu-toggle-action ff-panel">
            <span class="icon icon-times"></span>
          </a> 
          <div class="mobile-nav-scroll">
          </div>
        </nav>
    </div>
    <div class="ff-right-panel">
      <!--<ff-currency></ff-currency>-->
      <div class="currencies">
        <div v-for="coin of coins" v-bind:key="coin.id" class="currency">
          <span class="name">{{coin.attributes.symbol}}</span> 
          <span class="value"><span class="dollar">$</span>{{coin.attributes.price_usd}}</span> 
          <span class="perc" v-bind:class="{ neg: coin.attributes.percent_change24h < 0 }">{{coin.attributes.percent_change24h}}</span> 
        </div>

        <span class="currency currency-note">
          Use search to follow more currencies
        </span>

      </div>
    </div>

    <span class="vk_proof_code">vkff01-858-255</span>

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
    locale: 'en-US',
    locales: {
      // you will need json-loader in webpack 1
      'en-US': require('vue-timeago/locales/en-US.json')
    }
  })

</script>