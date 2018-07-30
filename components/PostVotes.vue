<template>
  <div class="post_votes">
    <span v-for="n in iconsCount(positives)" :key="n" class="ic_up"></span>
    <span v-for="n in iconsCount(negatives)" :key="-n" class="ic_down"></span>
  </div>
</template>

<script>
  export default {
    name: 'post-votes',
    props: {
      positives: 0,
      negatives: 0,
    },

    mounted() {
    },

    methods: {
      iconsCount( count ) {
        if( count > 3) {
          return 3
        }
        if( count > 0 ) {
          return count
        }
        return 0
      }
    }
  }
</script>
