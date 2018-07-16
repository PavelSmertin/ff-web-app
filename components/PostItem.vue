<template>
  <div class="ff-news-cell" v-bind:class="topPost">
    <div v-if="isTopPost()" v-bind:style="{ backgroundImage: 'url(' + getImageSharing() + ')' }" class="top_post_background" ></div>
    <div class="post_fade_overlay" ></div>

    <div class="ff_news_item_title row">
      <div class="col">
        <div class="ff-nc-title">
            {{ post.attributes.title }}
        </div>
      </div>
    </div>
    <div class="ff_news_item_details row no-gutters">
      <div class="col-2">
        <post-votes :positives="post.attributes.votes_positive" :negatives="post.attributes.votes_negative">
        </post-votes>
      </div>
      <div class="col-10">
        <ul class="news_list_detail">
          <li><timeago :since="post.attributes.create_dt" class="time-ago"></timeago></li>
          <li v-if="post.attributes.type == 'news'">Новость</li>
          <li v-else-if="post.attributes.type == 'prognosis'">Прогноз</li>
          <li class="post_source">{{ sourceDomain() }}</li>
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

    methods: {
     sourceDomain() {
        var domain = extractHostname( this.post.attributes.source_url ),
            splitArr = domain.split('.'),
            arrLen = splitArr.length;

        //extracting the root domain here
        //if there is a subdomain 
        if (arrLen > 2) {
            domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
            //check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
            if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
                //this is using a ccTLD
                domain = splitArr[arrLen - 3] + '.' + domain;
            }
        }
        return domain;
      },

      getImageSharing() {
        if( this.post.attributes.images.sharing ) {
          return '/images' + this.post.attributes.images.sharing
        }
        return '/FF_cover1080_b.png'
      },

      isTopPost() {
        return this.$store.state.topNews.indexOf( this.post.id )  >= 0
      }
    },

    computed: {
      topPost: function() {
        return {
          'top_post_item': this.isTopPost(),
        }
      },
    },

  }

  function extractHostname( url ) {
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