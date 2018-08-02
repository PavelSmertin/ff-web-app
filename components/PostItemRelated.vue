<template>
  <div class='related_news'>
    <div class='ff-label'>Статья по теме:</div>
    <a :href="linkToPost(newest)" class="ff-news-row">
      <post-item :post="newest" ></post-item>
    </a>
  </div>
</template>

<script>
  import PostItem from '~/components/PostItem.vue'

  export default {
    name: "releted-post-item",

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
      }
    }
  }
</script>