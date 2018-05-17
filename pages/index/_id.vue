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


  async asyncData({ req, params, error, redirect }) {
    if( process.client && params.newest) {
      return {
        attributes: params.newest
      }
    }

    try {
      const { data } = await axios.get(`https://api.ff.ru/v1/news/view/${+params.id}`)
 
      if( redirectToSlug(data.data.attributes.slug, params.slug) ) {
        redirect(301, { path: `/${+params.id}/${data.data.attributes.slug}` })
      } else {
        data.data.seoTitle = data.data.attributes.title + " - " + ((data.data.attributes.type == "news") ? "Новости Bitcoin (BTC/USD)" : "Прогноз курса Bitcoin (BTC/USD)") + ((data.data.attributes.type == "news") ? "" : " от " + moment().format('DD.MM.YYYY')) + " на FF.ru";
        return data.data
      }
    } catch (e) {
      error({ message: 'Newest not found', statusCode: 404 })
    }
  },

  head() {
    return {
      title: this.seoTitle,
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { 
          hid: 'description', 
          name: 'description', 
          content: this.attributes.title,
        },
        { property: 'article:published_time', content: '' },

        { property: 'og:title', content: this.seoTitle },
        { property: 'og:type', content: 'article' },
        { property: 'og:url', content: process.env.baseUrl + this.$route.path },
        { property: 'og:image', content: process.env.baseUrl + '/FF_cover_b.png' },
        { property: 'og:image:width', content: '968' },
        { property: 'og:image:height', content: '504' },
        { property: 'og:description', content: this.attributes.title },
        { property: 'og:site_name', content: 'FF.ru' },
        { property: 'og:locale', content: 'ru_RU' },

        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@www_FF_ru' },
        { name: 'twitter:creator', content: '@www_FF_ru' },
        { name: 'twitter:title', content: 'Курс Биткоина, новости и прогнозы Биткоина в реальном времени на FF.ru' },
        { name: 'twitter:description', content: this.attributes.title },
        { name: 'twitter:image', content: process.env.baseUrl + '/FF_cover_b.png' },

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


</script>