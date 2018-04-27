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

export default {
    transition: {
    name: 'page',
    mode: 'out-in',
    type: 'transition',
    // beforeEnter (el) {
    //   console.log('Before enter...');
    // },
    // beforeLeave (el) {
    //   console.log('Before leave...');
    // }
  },
  validate({ params }) {
    return !isNaN(+params.id)
  },
  fetch ({ params, redirect }) {
    // if(!params.newest.slug) {
    //   redirect(301, '/')
    // }
  },
  async asyncData({ params, error }) {
    try {
      const { data } = await axios.get(`https://api.ff.ru/v1/news/view/${+params.id}`)
      // if( params.slug && data.data.attributes.slug && params.slug == data.data.attributes.slug ) {
      //   return data.data
      // } 
      // if( !params.slug && !data.data.attributes.slug ) {
      //   return data.data
      // } 
      // error({ message: 'Newest not found', statusCode: 404 })
      return data.data
    } catch (e) {
      error({ message: 'Newest not found', statusCode: 404 })
    }
  },
  head() {
    return {
      title: this.attributes.title + " - ff.ru"
    }
  }
}
</script>