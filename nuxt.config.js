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
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
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
  ]
}
