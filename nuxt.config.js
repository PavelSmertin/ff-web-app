

const axios = require('axios')

module.exports = {

  /*
  ** Headers of the page
  */
  head: {
    title: 'Курс Bitcoin (BTC), новости и прогнозы Биткоина в реальном времени на FF.ru',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { 
        hid: 'description', 
        name: 'description', 
        content: 'Курс, новости, прогнозы Bitcoin (BTC) и криптовалют в реальном времени. Когда покупать Биткоин - поможем принять решение. Подпишись на новости и не упусти момент, когда цены начнут меняться.' 
      },
      { hid: 'og:title', property: 'og:title', content: 'Курс Bitcoin (BTC), новости и прогнозы Биткоина в реальном времени на FF.ru' },
      { property: 'og:type', content: 'website' },
      { hid: 'og:url', property: 'og:url', content:'' },
      { hid: 'og:image', property: 'og:image', content:''},
      { property: 'og:image:width', content: '968' },
      { property: 'og:image:height', content: '504' },
      { hid: 'og:description', property: 'og:description', content: 'Курс, новости, прогнозы Bitcoin (BTC) и криптовалют в реальном времени. Когда покупать Биткоин - поможем принять решение. Подпишись на новости и не упусти момент, когда цены начнут меняться.' },
      { property: 'og:site_name', content: 'FF.ru' },
      { property: 'og:locale', content: 'ru_RU' },

      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@www_FF_ru' },
      { name: 'twitter:creator', content: '@www_FF_ru' },
      { hid: 'twitter:title', name: 'twitter:title', content: 'Курс Биткоина, новости и прогнозы Биткоина в реальном времени на FF.ru' },
      { hid: 'twitter:description', name: 'twitter:description', content: 'Курс, новости, прогнозы Bitcoin (BTC) и криптовалют в реальном времени. Когда покупать Биткоин - поможем принять решение. Подпишись на новости и не упусти момент, когда цены начнут меняться.' },
      { hid: 'twitter:image', name: 'twitter:image', content:''},
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    bodyAttrs: {
      class: 'ff'
    },
    htmlAttrs: {
      prefix: 'og: http://ogp.me/ns# article: http://ogp.me/ns/article# fb: http://ogp.me/ns/fb# website: http://ogp.me/ns/website#'
    },
  },

  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },

  /*
  ** Build configuration
  */
  build: {

    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },

  css: [
    '@/assets/css/bind.scss'
  ],

  plugins: [
    // ssr: false to only include it on client-side
    { src: '~/plugins/vue-js-toggle-button.js'},
    { src: '~/plugins/ga.js', ssr: false },
    { src: '~/plugins/vue-chartjs.js', ssr: false },
    { src: '~/plugins/vue-socket.js', ssr: false },
  ],

  env: {
    baseUrl: process.env.BASE_URL || 'https://ff.ru',
  },

  router: {
    extendRoutes (routes, resolve) {

      let parent = routes.find((route) => {
        return route.path === '/'
      })

      parent.children.push({
        name: 'slug-id',
        path: ':id(\\d+)/:slug',
        chunkName: 'pages/index/_id',
        component: resolve(__dirname, 'pages/index/_id.vue')
      })
    }
  },

  modules: [
    //['@nuxtjs/google-tag-manager', { id: 'UA-52990017-1' }],
    ['@nuxtjs/yandex-metrika', {
      id: '25598768',
      webvisor: true,
      // clickmap:true,
      // useCDN:false,
      // trackLinks:true,
      // accurateTrackBounce:true,
      }
    ],
    '@nuxtjs/feed',
    '@nuxtjs/axios',
    'bootstrap-vue/nuxt',
  ],
  feed: [{
      path: '/rss_export', // The route to your feed.
      async create (feed) {
        feed.options = {
          title: 'Курс Bitcoin (BTC), новости и прогнозы Биткоина в реальном времени на FF.ru',
          description: 'Курс, новости, прогнозы Bitcoin (BTC) и криптовалют в реальном времени. Когда покупать Биткоин - поможем принять решение. Подпишись на новости и не упусти момент, когда цены начнут меняться.',
          language: 'ru-ru',
          generator: 'RSS for ff',
          id: 'https://ff.ru/',
          link: 'https://ff.ru/',
          favicon: 'https://ff.ru/favicon.ico',
          copyright: 'All rights reserved 2018, ff.ru',
        }

        const posts = await axios.get('https://api.ff.ru/v1/news/by-coin/1182', {
                            params: {
                              page: 1,
                              'per-page': 200
                            },
                          })
        const domain = 'https://ff.ru/';

        console.log(posts.data.data)

        posts.data.data.forEach(post => { 
          feed.addItem({
              title: post.attributes.title,
              id: domain + post.id + (post.attributes.slag ? ("/" + post.attributes.slag) : ""),
              link: domain + post.id + (post.attributes.slag ? ("/" + post.attributes.slag) : ""),
              content: post.attributes.body,
              pubDate: post.attributes.create_dt
          })
        
        })

        feed.addCategory('CryptoCurrency')
      
        feed.addContributor({
          name: 'Pavel Smertin',
          email: 'pashtetbezd@gmail.com',
          link: 'https://ff.ru/'
        })
      },
      cacheTime: 1000 * 60 * 15, // How long should the feed be cached
      type: 'rss2' // Can be: rss2, atom1, json1
    }
  ],


}
