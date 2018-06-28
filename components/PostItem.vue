<template>
  <div class="ff-news-cell">
    <div class="row">
      <div class="col">
        <div class="ff-nc-title">
            {{ post.attributes.title }}
        </div>
      </div>
    </div>
    <div class="row no-gutters">
      <div class="col-2">
        <post-votes :positives="post.attributes.votes_positive" :negatives="post.attributes.votes_negative">
        </post-votes>
      </div>
      <div class="col-10">
        <ul class="ff-label news_list_detail">
          <li><timeago :since="post.attributes.create_dt" class="time-ago"></timeago></li>
          <li v-if="post.attributes.type == 'news'">Новость</li>
          <li v-else-if="post.attributes.type == 'prognosis'">Прогноз</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import PostVotes from '~/components/PostVotes.vue'

  export default {
    name: 'post-item',

    components: {
      PostVotes,
    },

    props: {
      post: 0,
    },
  }
</script>