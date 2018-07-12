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
      }
    }
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