<template> 
  <div class="ff_contacts">
    <h1 class="margin40">О компании</h1>
    <h2 class="margin40">О проекте</h2>
    <p class="margin30">Проект работает с марта 2018 года, нацелен на пользователей, которые только знакомятся с миром криптовалют – как не потерять, как анализировать и проводить технический и фундаментальный анализ. Простая и удобная подача самой значимой информации, влияющей на стоимость криптовалют – прогнозы, новости, риски.</p>
    <p>Удобный инструмент ведения своего криптопортфеля с торговыми идеями от профессиональных трейдеров и экспертов рынка позволит вам зарабатывать на автопилоте. Мы предоставляем современные технологии и удобный интерфейс нашим пользователям.</p>
    <p>Доверьте ведение вашего портфеля тысячам профессионалов.
      Час работы трейдера стоит опыта всей его профессиональной жизни. В этой профессии выживают сильнейшие. Доверьтесь профессиональному опыту, учитесь на успехе профессионалов.</p>
    <h2 class="margin40">Наши ценности</h2>
    <h3 class="margin30">Прозрачность и открытость</h3>
    <p>Мы разделяем принцип открытости и честности – мы проанализируем, уберем лишнее и поделимся с вами самым важным включая возможные риски.</p>
    <h3 class="margin30">Экспертность и профессионализм</h3>
    <p>Мы постоянно обучаемся и держим руку на пульсе. Наши команда постоянные посетители топовых отраслевых мероприятий по крипто-атиквам и блокчейну.</p>
    <h3 class="margin30">Технологичность</h3>
    <p>Мы голосуем обеими руками за решение задач с помощью доступных новых технологий – Blockchain, AI, Crowd-sourcing.</p>
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