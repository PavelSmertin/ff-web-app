

const axios = require('axios')

module.exports = {

  /*
  ** Headers of the page
  */
  head: {
    title: 'Рыночная капитализация криптовалют - FF.ru',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { 
        hid: 'description', 
        name: 'description', 
        content: 'Рыночная капитализация криптовалют, рейтинг криптовалют, графики курса криптовалют в реальном времени, объемы рынка.',
      },

      { property: 'og:image:width', content: '968' },
      { property: 'og:image:height', content: '504' },
      { property: 'og:site_name', content: 'FF.ru' },
      { property: 'og:locale', content: 'ru_RU' },

      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@www_FF_ru' },
      { name: 'twitter:creator', content: '@www_FF_ru' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'alternate', type: 'application/rss+xml', title: "RSS", href: '/rss_export' }
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

    extractCSS: true,
    // analyze: true,
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

  // render: {
  //   gzip: true,
  // },

  css: [
    '@/assets/css/bootstrap.min.css',
    '@/assets/css/bind.scss',
  ],

  plugins: [
    // ssr: false to only include it on client-side
    { src: '~/plugins/ga.js', ssr: false },
    //{ src: '~/plugins/vue-socket.js', ssr: false },
    { src: '~/plugins/social.js' },
    { src: '~/plugins/vue-highcharts.js', ssr: false },
  ],

  env: {
    baseUrl: 'https://ff.ru',
    apiUrl: 'https://api.ff.ru',
  },

  router: {
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition
      } else {
        let position = {}
        if (to.matched.length < 2) {
          position = { x: 0, y: 0 }
        } else if (to.matched.some(r => r.components.default.options.scrollToTop)) {
          position = { x: 0, y: 0 }
        }
        if (to.hash) {
          position = { selector: to.hash }
        }
        return position
      }
    },

    extendRoutes (routes, resolve) {
      let parent = routes.find((route) => {
        return route.path === '/'
      });

      parent.children.find((r) => r.path.includes(':id')).path = ':id(\\d+)'
      parent.children.find((r) => r.path.includes(':symbol')).path = ':symbol([a-zA-Z]+)'

      parent.children.push({
        name: 'slug-id',
        path: ':id(\\d+)/:slug',
        chunkName: 'pages/index/_id',
        component: resolve(__dirname, 'pages/index/_id.vue')
      });
    },
  },

  modules: [
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
    '@nuxtjs/auth',
    //['@nuxtjs/moment', { locales: ['ru'], plugin: false }],
    ['@nuxtjs/proxy', { pathRewrite: { '^/api' : '/v1', '^/images' : '/' } }],
  ],


  axios: {
    baseUrl: 'https://ff.ru',
    browserBaseURL: 'https://ff.ru',
    // proxy: true,
    // proxyHeaders: true,
    // credentials: false,
    // debug: true,
    // // proxyHeaders: false,
    // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    // // headers: {'Access-Control-Allow-Origin': '*'},

    // // config.headers['Content-Type'] = 'application/json';

    // requestInterceptor: (config, { store }) => {
    //   console.log('requestInterceptor')
    //   console.log(config)
    //   config.headers.common['Content-Type'] = 'application/x-www-form-urlencoded'
    //   return config
    // },
  },

  proxy: {
    '/api': 'https://api.ff.ru',
    '/images': 'https://api.ff.ru',
  },

  auth: {
    
    redirect: {
      login: '/',
    },

    token: {
      prefix: 'token.'
    },

    defaultStrategy: 'api',

    strategies: {
      api: {
        _scheme: '~/schemes/api.js',
        endpoints: {
          login: {
            url: '/api/auth/login',
            method: 'post',
            propertyName: 'access_token'
          },
          logout: false
        }
      }
    }
  },

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

        const posts = await axios.get('https://api.ff.ru/v1/news/', {
                            params: {
                              page: 1,
                              'per-page': 200
                            },
                          })
        const domain = 'https://ff.ru/';

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
