<template>
  <div class="ff-post">
    <div class="news-detail">
      <ul class="ff-label news_list_detail">
        <li><timeago :since="attributes.create_dt" class="time-ago"></timeago></li>
        <li>Перевод: {{translationTime}} </li>
        <li v-if="attributes.type == 'news'">Новость</li>
        <li v-else-if="attributes.type == 'prognosis'">Прогноз</li>
      </ul>
    </div>
    <h1 class="post-header">
      {{attributes.title}}
    </h1>
    <p v-html="attributes.body" class="description"></p>
    <p class="post_source">
      <a target="_blank" rel="nofollow noopener noreferrer" :href="attributes.source_url">Ссылка на источник</a>
    </p>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'

var MINUTE = 60;
var HOUR = MINUTE * 60;
var DAY = HOUR * 24;
var WEEK = DAY * 7;
var MONTH = DAY * 30;
var YEAR = DAY * 365;

export default {

  transition: {
    name: 'page',
    mode: 'out-in',
    type: 'transition',
  },

  validate({ params }) {
    return !isNaN(+params.id)
  },


  data() {
    var title = "Новости Bitcoin (BTC/USD) на FF.ru";
    var seoTitle = "Новости Bitcoin (BTC/USD) на FF.ru";
    return {
      title: title,
      seoTitle: title,
    }
  },

  async asyncData({ req, params, error, redirect }) {

    if( process.client && params.newest) {
      return {
        seoTitle: setMeta(params.newest.title, params.newest.type),
        attributes: params.newest
      }
    }

    try {
      const { data } = await axios.get(`https://api.ff.ru/v1/news/view/${+params.id}`)
 
      if( redirectToSlug(data.data.attributes.slug, params.slug) ) {
        redirect(301, { path: `/${+params.id}/${data.data.attributes.slug}` })
      } else {
        console.log(data.data);
        return {
          seoTitle: setMeta(data.data.attributes.title, data.data.attributes.type),
          attributes: data.data.attributes
        }
      }
    } catch (e) {
      error({ message: 'Newest not found', statusCode: 404 })
    }
  },

  head() {
    return {
      title: this.seoTitle,
      meta: [
        { 
          hid: 'description', 
          name: 'description', 
          content: this.title,
        },
        { property: 'article:published_time', content: '' },
        { hid: 'og:title', property: 'og:title', content: this.seoTitle },
        { hid: 'og:url', property: 'og:url', content: process.env.baseUrl + this.$route.path },
        { hid: 'og:image', property: 'og:image', content: process.env.baseUrl + '/FF_cover_b.png' },
        { hid: 'og:description', property: 'og:description', content: this.title },
        { hid: 'twitter:title',name: 'twitter:title', content: 'Курс Биткоина, новости и прогнозы Биткоина в реальном времени на FF.ru' },
        { hid: 'twitter:description', name: 'twitter:description', content: this.title },
        { hid: 'twitter:image', name: 'twitter:image', content: process.env.baseUrl + '/FF_cover_b.png' },

      ],
    }
  },

  computed: {
    translationTime: function() {

        var seconds = this.attributes.time_for_translation;
        var ret =
          seconds <= MINUTE
              ? pluralOrSingular(seconds, 'сек')
              : seconds < HOUR
                ? pluralOrSingular(seconds / MINUTE, 'мин')
                : seconds < DAY
                  ? pluralOrSingular(seconds / HOUR, 'ч')
                  : seconds < WEEK
                    ? pluralOrSingular(seconds / DAY, 'д')
                    : seconds < MONTH
                      ? pluralOrSingular(seconds / WEEK, 'н')
                      : seconds < YEAR
                        ? pluralOrSingular(seconds / MONTH, 'мес')
                        : pluralOrSingular(seconds / YEAR, 'г');

      return ret
    }
  }
}


function redirectToSlug(data, slug) {
  // Переход по ссылке со slug
  if( slug && data && slug == data ) {
    return false
  } 

  // Переход по ссылке без slug
  if( !slug && !data ) {
    return false
  }

  // Редирект на slug
  if( !slug ) {
    return true
  } 

  throw new Error('Newest not found');
}


function pluralOrSingular(data, locale) {
  var count = Math.round(data);
  return count + " " + locale;
}

function setMeta(title, type) {
  return title + " - " + ((type == "news") ? "Новости Bitcoin (BTC/USD)" : "Прогноз курса Bitcoin (BTC/USD)") + ((type == "news") ? "" : " от " + moment().format('DD.MM.YYYY')) + " на FF.ru";
}


</script>