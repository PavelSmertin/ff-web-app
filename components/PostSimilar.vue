<template>
  <nuxt-link @click.native="onSimilarClick()" class="similar_item" :to="{path: linkToPost() }">

    <div class="similar_image" v-bind:style="{ backgroundImage: 'url(' + getImageShared() + ')' }"></div>

    <ul class="news_list_detail">
      <li><timeago :since="post.create_dt" class="time-ago"></timeago></li>
      <li v-if="post.type == 'news'">Новость</li>
      <li v-else-if="post.type == 'prognosis'">Прогноз</li>
    </ul>

    <div>
      <div class="item_title ff_nc_title margin8">
        {{ post.title }}
      </div>
    </div>

    <div class="item_body second_font margin12">{{ stripSocialDesription( 150 ) }}</div>

  </nuxt-link>
</template>

<script>

  import { analMixin } from '~/components/mixins/analitics.js'

  export default {
    name: 'post-similar',

    mixins: [ analMixin ],

    props: {
      post: 0,
    },

    methods: {
      getImageShared() {
        if (this.post.images.sharing) {
          return '/images' + this.post.images.sharing
        }
        return '/FF_cover968_b.png'
      },

      stripSocialDesription( desriptionLength ) {
        let str = this.post.body
        if( str === null || str === '' )
          return false;
        else
          str = str.toString();
        return str.replace(/<[^>]*>/g, '').substring(0, desriptionLength) + "...";
      },

      linkToPost() {
        return '/' + this.post.id + ( this.post.slug ? '/' + this.post.slug : '' )
      },
      onSimilarClick: function ( ) {
        this.sendEvent( 'NewsSimilar', 'click', this.post.id );
      },
    },

  }




</script>