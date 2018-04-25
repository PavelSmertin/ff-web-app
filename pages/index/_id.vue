<template>
  <div class="pane-inner-no-pad">
<!--     <div class="votes-grid">
      <div class="votes-grid-row">
        <a href="" class="vote-like">
          <span class="icon icon-thumbs-up"></span>
          Like
          <span class="hover-label">Vote if you like this post</span>
        </a> 
        <a href="" class="vote-dislike">
          <span class="icon icon-thumbs-down">
          </span>
          Dislike
          <span class="hover-label">Vote if you don't like this post</span>
        </a>
        <a href="" class="vote-lol">
          <span class="icon icon-lol"></span>
          LOL
          <span class="hover-label">Mark good fun posts and memes</span>
        </a>
        <a href="" class="vote-save">
          <span class="icon icon-star-two"></span>
          Save
          <span class="hover-label">Save for later</span>
        </a>
      </div> 
      <div class="votes-grid-row">
        <a href="" class="vote-positive">
          <span class="icon icon-up"></span>
          Bullish
          <span class="hover-label">Vote only if this post is signaling positive impact on price</span>
        </a> 
        <a href="" class="vote-negative">
          <span class="icon icon-down"></span>
          Bearish
          <span class="hover-label">Vote only if this post is signaling negative impact on price</span>
        </a>
        <a href="" class="vote-important">
          <span class="icon icon-attention"></span>
          Important
          <span class="hover-label">Vote if this is industry wide impacting news post</span>
        </a> 
        <a href="" class="vote-toxic">
          <span class="icon icon-toxic"></span>
          Toxic
          <span class="hover-label">Vote if this is shill, fud, fake, misleading post (PRO only)</span>
        </a>
      </div>
    </div> -->
    <div class="news-detail">
      <div class="post-header">
        <h1 class="post-title">
          <span class="text">{{attributes.title}}</span>
          <span class="post-currencies"></span>
        </h1>
      </div>
      <div class="description">
        <div class="description-body">
          <p v-html="attributes.body"></p>
        </div>
      </div>
      <div class="post-footer">
        <div class="filter-source">
          <a href="/" class="colored-link">Filter by source</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
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
      if( params.slug && data.data.attributes.slug && params.slug == data.data.attributes.slug ) {
        return data.data
      } 
      if( !params.slug && !data.data.attributes.slug ) {
        return data.data
      } 
      error({ message: 'Newest not found', statusCode: 404 })
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