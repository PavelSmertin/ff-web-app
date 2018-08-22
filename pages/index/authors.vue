<template> 
  <div class="ff_page">
  	<h1 class="margin40">Список всех авторов</h1>
    <div class="author_row margin60" v-for="author of authors" v-bind:key="author.id" >
      <h3 class="author_name">{{ author.attributes.full_name }}</h3>
      <div class="author_description">{{ author.attributes.description }}</div>
    </div>
  </div>
</template>


<script>
  export default {

  head() {
    return {
      title: 'Список всех авторов',
      meta: [
        { 
          hid: 'description', 
          name: 'description', 
          content: 'Список авторов новостей и прогнозов',
        },
        { hid: 'og:type', property: 'og:type', content: 'website' },
        { hid: 'og:url', property: 'og:url', content: process.env.baseUrl },
        { hid: 'og:image', property: 'og:image', content: process.env.baseUrl + '/FF_cover968_b.png' },
        { hid: 'twitter:image', name: 'twitter:image', content: process.env.baseUrl + '/FF_cover968_b.png' },

        { hid: 'og:title', property: 'og:title', content: 'Список всех авторов' },
        { hid: 'og:description', property: 'og:description', content: 'Список авторов новостей и прогнозов' },
        { hid: 'twitter:title', name: 'twitter:title', content: 'Список всех авторов' },
        { hid: 'twitter:description', name: 'twitter:description', content: 'Список авторов новостей и прогнозов' },
      ],
    }
  },

  async asyncData ({ app, params, error }) {
    let { data } = await app.$axios.get(`/api/news/authors`)
    return  { authors: data.data }
  },

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