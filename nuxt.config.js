

const axios = require('axios')

module.exports = {
  
  /*
  ** Headers of the page
  */
  head: {
    title: 'ff',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'ff project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon-v2.ico' }
    ],
    bodyAttrs: {
      class: 'ff'
    }
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
    '~assets/css/main.css'
  ],

  plugins: [
    // ssr: false to only include it on client-side
    { src: '~/plugins/vue-js-toggle-button.js'},
    { src: '~/plugins/ga.js', ssr: false },
  ],


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
    '@nuxtjs/axios'
  ],
  feed: [{
      path: '/rss_export', // The route to your feed.
      async create (feed) {
        feed.options = {
          title: 'эф-эф',
          description: 'Агрегатор новостей из глубин криптомира!',
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
