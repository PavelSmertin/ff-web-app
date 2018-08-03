<template>
  <div class="comment_item">
    <div class="comment_head">
      <span class="comment_head_author">{{ user_name }}</span>
      <span class="comment_head_time"><timeago :since="comment.created_dt" class="time-ago"></timeago></span>
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
      user_name: function () {
        console.log(this.comment);
        if (this.comment.user) {
          return this.comment.user.user_name
        } else {
          return 'Аноним'
        }

      }
    },

  }
</script>
