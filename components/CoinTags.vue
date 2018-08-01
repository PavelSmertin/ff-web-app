<template>
  <div class="coin_tags">
    <span v-if="coinTags()" v-html="coinTags()" class="coin_tag"></span>
  </div>
</template>

<script>
  export default {
    name: 'coin-tags',
    props: {
      tags: null,
    },

    methods: {
      coinTags: function () {
      	if( this.tags == null || this.tags == undefined )  {
      		return null
      	}
      	if( this.tags.length == 1 ) {
      		return this.tags[0].symbol
      	}
        return '&there4; ' + this.tags.length
      },
    }
  }
</script>