<template>
  <div class="comment_item">
    <div class="comment_head">
      <span class="comment_head_author">{{ userName }}</span>
      <span class="comment_head_time"><timeago :since="comment.created_at" class="time-ago"></timeago></span>
    </div>
    <div class="comment_body">
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
      }
    },

  }
</script>
