
let urls = require( './urls_default.js' ) 
try { 
  urls = require( './urls.js' ) 
}
catch( e ) {
  
}


export default {

  /*
  ** Headers of the page
  */
  head: {
    title: 'Рыночная капитализация криптовалют - FF.ru',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=2.0' },
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
      { name: 'msvalidate.01', content: '4EA18548A13D86C097A4E205BE1CD244' },
      { name: 'theme-color', content: '#000000' },
    ],

    link: [
      { rel: 'icon', type: 'image/png', href: '/favicon.png' },
      { rel:'mask-icon', href: '/apple-touch-icon.svg' },
      { rel:'icon', type: 'image/svg+xml', href: '/favicon.svg' },

      { rel: 'alternate', type: 'application/rss+xml', title: "RSS", href: '/rss-export' },
    ],

    bodyAttrs: {
      class: 'ff'
    },
    htmlAttrs: {
      prefix: 'og: http://ogp.me/ns# article: http://ogp.me/ns/article# fb: http://ogp.me/ns/fb# website: http://ogp.me/ns/website#',
      lang: 'ru',
    },
  },

  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },

  /*
  ** Build configuration
  */
  // build: {

  //   vendor: ['intersection-observer', 'jsona'],
  //   // extractCSS: true,
  //   //analyze: true,
  //   /*
  //   ** Run ESLint on save
  //   */
  //   extend (config, { isDev, isClient }) {
  //     if (isDev && isClient) {
  //       config.module.rules.push({
  //         enforce: 'pre',
  //         test: /\.(js|vue)$/,
  //         loader: 'eslint-loader',
  //         exclude: /(node_modules)/
  //       })
  //     }
  //   }
  // },

  css: [
    'normalize.css',
    '@/assets/css/bind.scss',
  ],

  plugins: [
    // ssr: false to only include it on client-side
    { src: '~/plugins/ga.js', ssr: false },
    { src: '~/plugins/mailru.js', ssr: false },
    { src: '~/plugins/vue-socket.js', ssr: false },
    { src: '~/plugins/social.js' },
    { src: '~/plugins/vue-observe-visibility.js', ssr: false  },
    { src: '~/plugins/intersection-observer.js', ssr: false  }, // for safary browser
    '~/plugins/axios',
    '~/plugins/data-formatter',
    { src: '~plugins/vue-cookie-law.js', ssr: false }
  ],

  env: {
    baseUrl: urls.host,
    apiUrl: urls.api,
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
      })

      let symbolRoute = parent.children.find( r => r.path.includes(':symbol') )
      let postRoute = symbolRoute.children.find( r => r.path.includes(':id') )


      symbolRoute.path = ':symbol([a-zA-Z]+[0-9]*\\*?)?'
      postRoute.path = '/:id(\\d+)'
      postRoute.redirect = ''

      symbolRoute.children.push({
        name: 'slug-id',
        path: '/:id(\\d+)/:slug',
        chunkName: 'pages/index/_symbol/_id',
        component: resolve(__dirname, 'pages/index/_symbol/_id.vue'),
        redirect: '',
      })

      // parent.children.forEach( el => {
      //   console.log(el); 
      //   console.log(el.children);
      // })
    },
  },

  modules: [
    ['@nuxtjs/yandex-metrika', {
      id: '25598768',
      webvisor: true,
      clickmap:true,
      // useCDN:false,
      trackLinks:true,
      // accurateTrackBounce:true,
      }
    ],
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    ['@nuxtjs/proxy', { pathRewrite: { '^/api' : '/v1', '^/images' : '/' } }],
    ['@nuxtjs/pwa', { meta: false, oneSignal: false, manifest: false, icon: false }],
    'nuxt-webfontloader',
    '@miyaoka/nuxt-twitter-widgets-module',
    ['@nuxtjs/google-adsense', {
      id: 'ca-pub-2614203244283408',
      pageLevelAds: true,
      includeQuery: true,
      // test: true,
    }]
  ],

  axios: {
    baseUrl: urls.host,
    browserBaseURL: urls.host,
  },

  proxy: {
    '/api': urls.api,
    '/images': urls.api,
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

  workbox: {
   // Workbox options
  },

  manifest: {
    name: 'FF.ru',
    lang: 'ru',
  },

  webfontloader: {
    google: {
      families: ['IBM+Plex+Sans:400,500,700'] //Loads Lato font with weights 400 and 700
    }
  },

  resolve: {
    alias: {
      'vue$': 'vue/dist/vue'
    }
  }

}
