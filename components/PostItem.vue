<template>
  <div v-if="!isTopPost()" class="ff_news_cell">
    <div class="ff_news_item_title ff_nc_title">
      {{ post.title }}
    </div>
    <div class="ff_news_item_details no-gutters">
      <ul class="news_list_detail">
        <li v-if="post.is_top !== true"><timeago :since="post.create_dt" class="time-ago"></timeago></li>
        <li class="post_type">{{ postType }}</li>
        <li><post-votes :positives="post.votes_positive" :negatives="post.votes_negative"></post-votes></li>
        <li class="post_source">{{ sourceDomain() }}</li>
        <li class="coin_tags"><coin-tags :tags="post.coins"></coin-tags></li>
      </ul>
    </div>
  </div>
</template>

<script>
  import PostVotes from '~/components/PostVotes.vue'
  import CoinTags from '~/components/CoinTags.vue'

  export default {
    name: 'post-item',

    components: {
      PostVotes,
      CoinTags,
    },

    props: {
      post: 0,
      isFirst: false,
    },

    methods: {
      sourceDomain() {
        var domain = extractHostname(this.post.source_url),
            splitArr = domain.split('.'),
            arrLen = splitArr.length;

        //extracting the root domain here
        //if there is a subdomain 
        if (arrLen > 2) {
          domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
          //check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
          if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
            //this is using a ccTLD
            domain = splitArr[arrLen - 3] + '.' + domain
          }
        }
        return domain
      },

      getImageSharing() {
        if (this.post.images.sharing) {
          return '/images' + this.post.images.sharing
        }
        return '/FF_cover968_b.png'
      },

      isTopPost() {
        if (this.$store) {
          return this.$store.state.topNews.indexOf( this.post.id ) >= 0
        }
        return false
      },
    },

    computed: {

      postType: function () {
        if( this.post.type == 'news' ) {
          return 'Новость'
        }
        if( this.post.type == 'prognosis' ) {
          return 'Прогноз'
        }
        if( this.post.type == 'signals' ) {
          return 'Сигнал'
        }
        return ''
      },

    }

  }

  function extractHostname(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("://") > -1) {
      hostname = url.split('/')[2];
    }
    else {
      hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
  }

</script>