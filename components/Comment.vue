<template>
  <div class="comment_item">

    <div v-if="commentType" class="comment_icon">
      <span :class='commentType'></span>
    </div>

    <div class="comment_body">
      <div class="comment_head">
        <span class="comment_head_author">{{ userName }}</span>
        <span class="comment_head_time"><timeago :since="comment.created_at" class="time-ago"></timeago></span>
      </div>
      <p class="comment_body_text">{{comment.comment}}</p>
    </div>

  </div>
</template>

<script>
  export default {
    name: "comment",

    props: {
      comment: 0,
    },

    computed: {
      userName: function () {
        return this.comment.user ? this.comment.user.user_name : 'Аноним'
      },
      commentType: function () {
        return  this.comment.type == 'positive' ? 'ic_up' : this.comment.type == 'negative' ? 'ic_down' : null
      },
    },

  }
</script>
