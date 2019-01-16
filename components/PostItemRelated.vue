<template>
  <div class='related_news'>
    <div class='ff_label'>Статья по теме:</div>
    <a @click.native="onRelatedClick( newest.id )" :href="linkToPost(newest)" class="ff_news_row">
      <post-item :post="newest" ></post-item>
    </a>
  </div>
</template>

<script>
  import PostItem from '~/components/PostItem.vue'
  import { analMixin } from '~/components/mixins/analitics.js'

  export default {

    mixins: [analMixin],

    props: {
      newest: 0,
    },

    components: {
      PostItem
    },

    methods: {

      linkToPost( newest ) {
        if( newest.slug ) {
          return '/' + newest.id + '/' + newest.slug
        }
        return '/' + newest.id;
      },

      onPostClick: function ( postId ) {
        this.sendEvent( 'NewsRelated', 'click', postId );
      },
    }
  }
</script>