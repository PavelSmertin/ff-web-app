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
    <div v-html="attributes.body" class="description"></div>
    <div class="post_source">
      <a target="_blank" rel="nofollow noopener noreferrer" :href="attributes.source_url">Ссылка на источник</a>
    </div>
    <div class="tools">
      <div v-if="showSocial" class="social">

        <social-sharing :url="url"
                      :title="title"
                      :description="body"
                      :quote="body"
                      twitter-user="www_FF_ru"
                      inline-template>
          <div>
            <network network="facebook">
              <img src="/facebook.svg" alt="facebook" />
            </network>
            <network network="telegram">
              <img src="/telegram.svg" alt="telegram" />
            </network>
            <network network="twitter">
              <img src="/twitter.svg" alt="twitter" />
            </network>
            <network network="vk">
              <img src="/vk.svg" alt="vk" />
            </network>
          </div>
        </social-sharing>
      </div>    
    </div>
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
      showSocial: false,
      url: process.env.baseUrl + this.$route.path,
      title: title,
      seoTitle: title,
      body: ''
    }
  },

  async asyncData({ req, params, error, redirect }) {

    if( process.client && params.newest) {
      return {
        title: params.newest.title,
        seoTitle: setMeta(params.newest.title, params.newest.type),
        body: params.newest.body,
        attributes: params.newest
      }
    }

    try {
      const { data } = await axios.get(`https://api.ff.ru/v1/news/view/${+params.id}`)
 
      if( redirectToSlug(data.data.attributes.slug, params.slug) ) {
        redirect(301, { path: `/${+params.id}/${data.data.attributes.slug}` })
      } else {
        return {
          title: data.data.attributes.title,
          seoTitle: setMeta(data.data.attributes.title, data.data.attributes.type),
          body: data.data.attributes.body,
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
        { hid: 'og:type', property: 'og:type', content: 'article' },
        { property: 'article:published_time', content: '' },
        { hid: 'og:title', property: 'og:title', content: this.title },
        { hid: 'og:url', property: 'og:url', content: process.env.baseUrl + this.$route.path },
        { hid: 'og:image', property: 'og:image', content: process.env.baseUrl + '/FF_cover_b.png' },
        { hid: 'og:description', property: 'og:description', content: strip_social_desription(this.body, 200) },
        { hid: 'twitter:title',name: 'twitter:title', content: this.title },
        { hid: 'twitter:description', name: 'twitter:description', content: strip_social_desription(this.body, 200) },
        { hid: 'twitter:image', name: 'twitter:image', content: process.env.baseUrl + '/FF_cover_b.png' },

      ],
    }
  },

  mounted () {
    this.showSocial = true // showLine will only be set to true on the client. This keeps the DOM-tree in sync.
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

function strip_social_desription(str, desriptionLength) {
  if ((str===null) || (str===''))
    return false;
  else
    str = str.toString();
  return str.replace(/<[^>]*>/g, '').substring(0, desriptionLength) + "...";
}
</script>