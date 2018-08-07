<template> 
  <div class="ff_contacts">
    <h1 class="margin40">О компании</h1>
    <h2 class="margin40">Контакты</h2>
    <address class="margin30">
      <div class="contact_row">
        <dt>Адрес:</dt><dd>115054, Россия, Москва, пер. Монетчиковский 5-й, д. 16, пом. II, ком. 8.</dd>
      </div>
      <div class="contact_row">
        <dt>Тел:</dt><dd>+7 (951) 067-06-66</dd>
      </div>
      <div class="contact_row">
        <dt>E-mail:</dt><dd>support@ff.ru</dd>
      </div>
    </address>
  </div>
</template>


<script>
  export default {

  head() {
    return {
      title: 'О компании',
      meta: [
        { 
          hid: 'description', 
          name: 'description', 
          content: 'Как нас найти? Что это такое?',
        },
        { hid: 'og:type', property: 'og:type', content: 'website' },
        { hid: 'og:url', property: 'og:url', content: process.env.baseUrl },
        { hid: 'og:image', property: 'og:image', content: process.env.baseUrl + '/FF_cover968_b.png' },
        { hid: 'twitter:image', name: 'twitter:image', content: process.env.baseUrl + '/FF_cover968_b.png' },

        { hid: 'og:title', property: 'og:title', content: 'О компании' },
        { hid: 'og:description', property: 'og:description', content: 'Как нас найти? Что это такое?' },
        { hid: 'twitter:title', name: 'twitter:title', content: 'О компании' },
        { hid: 'twitter:description', name: 'twitter:description', content: 'Как нас найти? Что это такое?' },
      ],

    }
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