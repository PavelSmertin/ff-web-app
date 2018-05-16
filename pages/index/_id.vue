<template>
  <div class="ff-post">
    <div class="news-detail"></div>
      <h1 class="post-header">
        {{attributes.title}}
      </h1>
      <p v-html="attributes.body" class="description"></p>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'

export default {

  transition: {
    name: 'page',
    mode: 'out-in',
    type: 'transition',
  },

  validate({ params }) {
    return !isNaN(+params.id)
  },

  async asyncData({ params, error, redirect }) {
    if( process.client ) {
      return {
        attributes: params.newest
      }
    }

    try {
      const { data } = await axios.get(`https://api.ff.ru/v1/news/view/${+params.id}`)
 
      if( redirectToSlug(data.data.attributes.slug, params.slug) ) {
        redirect(301, { path: `/${+params.id}/${data.data.attributes.slug}` })
      } else {
        return data.data
      }
    } catch (e) {
      error({ message: 'Newest not found', statusCode: 404 })
    }
  },

  head() {
    return {
      title: this.attributes.title + " - " + ((this.attributes.type == "news") ? "Новости Bitcoin (BTC/USD)" : "Прогноз курса Bitcoin (BTC/USD)") + ((this.attributes.type == "news") ? "" : " от " + moment().format('DD.MM.YYYY')) + " на ФФ.ру",
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { 
          hid: 'description', 
          name: 'description', 
          content: this.attributes.title,
        }
      ],
    }
  },
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

</script>