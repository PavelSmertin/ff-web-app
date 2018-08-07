<template> 
  <div class="ff-authors">
  	<h1>Список всех авторов</h1>
<!--     <div v-for="author of authors">{{ author }}</div>
 -->  </div>
</template>


<script>
  export default {

  // head() {
  //   return {
  //     title: 'Что такое биткоин простыми словами| Суть Bitcoin (BTC)',
  //     meta: [
  //       { 
  //         hid: 'description', 
  //         name: 'description', 
  //         content: 'Биткоин - первая криптовалюта, ставшая всемирно-известной в 2017 году. Основная суть биткоина состоит в децентрализации.',
  //       },
  //       { hid: 'og:type', property: 'og:type', content: 'website' },
  //       { hid: 'og:url', property: 'og:url', content: process.env.baseUrl },
  //       { hid: 'og:image', property: 'og:image', content: process.env.baseUrl + '/FF_cover968_b.png' },
  //       { hid: 'twitter:image', name: 'twitter:image', content: process.env.baseUrl + '/FF_cover968_b.png' },

  //       { hid: 'og:title', property: 'og:title', content: 'Что такое биткоин простыми словами| Суть Bitcoin (BTC)' },
  //       { hid: 'og:description', property: 'og:description', content: 'Description Биткоин - первая криптовалюта, ставшая всемирно-известной в 2017 году. Основная суть биткоина состоит в децентрализации.' },
  //       { hid: 'twitter:title', name: 'twitter:title', content: 'Что такое биткоин простыми словами| Суть Bitcoin (BTC)' },
  //       { hid: 'twitter:description', name: 'twitter:description', content: 'Description Биткоин - первая криптовалюта, ставшая всемирно-известной в 2017 году. Основная суть биткоина состоит в децентрализации.' },
  //     ],
  //   }
  // },

  // async asyncData({ app, req, params, error, redirect, route, store }) {
  //   const dataFormatter = new Jsona();

  //   try {
  //     const { data } = await app.$axios.get(`/api/authors`)

  //     if( redirectToSlug(data.data.attributes.slug, params.slug) ) {
  //       redirect(301, { path: `/${+params.id}/${data.data.attributes.slug}` })
  //     } else {

  //       return {
  //         url:        process.env.baseUrl +  "/" + data.data.id,
  //         title:      data.data.attributes.title,
  //         seoTitle:   getTitle(data.data.attributes),
  //         body:       data.data.attributes.body,
  //         attributes: data.data.attributes,
  //         news:       [ dataFormatter.deserialize( data ) ],
  //         first:      data.data.id,
  //       }

  //     }
  //   } catch (e) {
  //     if( e.response && e.response.status == 404 ) {
  //       error({ message: 'Newest not found', statusCode: 404 })
  //     }
  //   }
  // },


  mounted () {
    this.goto()
  },

  methods: {
    goto() {
      var element = this.$parent.$refs["scroll-container"];
      element.scrollTo(0, 0);
    },
  }

 }
 
</script>