 <template>
  <article 
    v-observe-visibility="(isVisible, entry) => visibilityChanged(isVisible, entry, post.id)" 
    class="ff-post" 
    itemscope itemtype="http://schema.org/NewsArticle"
    >

    {{ $route.path }}

    <!-- Ссылка на статью -->
    <link itemprop="mainEntityOfPage" itemscope v-bind:href="url">
 
    <!-- Данные о сайте: лого, телефон, адрес, название -->
    <div itemprop="publisher" itemscope itemtype="https://schema.org/Organization">
        <meta itemprop="name" content="ff.ru">
    </div>
 
    <!-- Автор статьи -->
    <!--     <span itemprop="author" itemscope itemtype="http://schema.org/Person">
        <span itemprop="name"></span>
    </span> -->
   
    <div class="news-detail">
      <ul class="ff-label news_list_detail">
        <li >
          <timeago :since="post.create_dt" class="time-ago"></timeago>    
          <meta itemprop="datePublished" v-bind:content="post.create_dt">
        </li>
        <li v-if="post.type == 'news'">Новость</li>
        <li v-else-if="post.type == 'prognosis'">Прогноз</li>
      </ul>
    </div>
    
    <h1 class="post-header" itemprop="headline" >
      {{ post.title }}
    </h1>

    <span v-if="getImageOriginal()" itemprop="image" itemscope itemtype="https://schema.org/ImageObject">
      <img class="image_origin" v-bind:itemprop="getImageOriginal()" v-bind:alt="seoTitle" v-bind:title="seoTitle" :src="getImageOriginal()"/>
    </span>

    <div itemprop="articleBody" v-html="post.body" class="description"></div>
    <div class="post_source ff-label" itemprop="isBasedOn">
        Источник: {{ sourceDomain() }}
    </div>
    <div class="tools">

      <button class="vote_up" v-on:click="vote(1)">
        <span class="ic_up"></span><span class="votes_count">{{ post.votes_positive }}</span>
      </button>
      <button class="vote_down" v-on:click="vote(0)">
        <span class="ic_down"></span><span class="votes_count">{{ post.votes_negative }}</span>
      </button>

      <div v-if="showSocial" class="social">

        <social-sharing :networks="overriddenNetworks"
                      :url="url"
                      :title="title"
                      :description="stripSocialDesription"
                      :quote="stripSocialDesription"
                      twitter-user="www_FF_ru"
                      inline-template>
          <div>
            <network 
              network="facebook" 
              class="social_link fb" 
              @open="open()" 
              @change="change()" 
              @close="close()">
            </network>
            <network 
              network="telegram" 
              class="social_link tg" 
              @open="open('telegram')" 
              @change="change('telegram')" 
              @close="close('telegram')">
            </network>
            <network 
              network="twitter" 
              class="social_link tr" 
              @open="open('twitter')" 
              @change="change('twitter')" 
              @close="close('twitter')">
            </network>
            <network 
              network="vk" 
              class="social_link vk" 
              @open="open('vk')" 
              @change="change('vk')" 
              @close="close('vk')">
            </network>
          </div>
        </social-sharing>
      </div>    
    </div>
  </article>
</template>

<script>

  import BaseNetworks from '@/assets/networks.json'

  
  export default {
    name: 'post-item',

    props: {
      post: 0,
    },

    data() {
      return {
        showSocial: false,
        url: process.env.baseUrl + this.$route.path,
        title: '',
        seoTitle: getTitle( this.post ),        
        body: '',
        overriddenNetworks: BaseNetworks,
      }
    },

    mounted () {
      this.showSocial = true // showLine will only be set to true on the client. This keeps the DOM-tree in sync.
    },

    computed: {
      stripSocialDesription: function() {
        var str = this.post.body
        if ((str === null) || (str === ''))
          return false;
        else
          str = str.toString();
        return str.replace(/<[^>]*>/g, '')
      }
    },

    methods: {
      sourceDomain() {
        var domain = extractHostname(this.post.source_url),
            splitArr = domain.split('.'),
            arrLen = splitArr.length

        //extracting the root domain here
        //if there is a subdomain 
        if (arrLen > 2) {
          domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1]
          //check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
          if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
            //this is using a ccTLD
            domain = splitArr[arrLen - 3] + '.' + domain
          }
        }
        return domain
      },
      getImageOriginal() {
        if( this.post.images.original ) {
          return '/images' + this.post.images.original
        }
        return false
      },
      vote( is_positive ) {
        this.$axios.post(`/api/news/${ this.post.id }/vote`, `is_positive=${is_positive}`)
          .then(({ data }) => {
            this.post = data.data.attributes
          }).catch(e => {
            if (e.response && e.response.status == 401) {
              this.$router.push({ name: `account-signin` })
            }
          })
      },
      visibilityChanged( isVisible, entry, postId ) {
        if( isVisible ) {
          //this.$router.replace({path: '/' + postId})
          let path = '/' + postId
          window.history.pushState({}, null, path )
          if (process.env.NODE_ENV !== 'production') {
            return
          }
          ga('set', 'page', path)
          ga('send', 'pageview')
        } 
      }

    }
  }

  function extractHostname( url ) {

    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("://") > -1) {
        hostname = url.split('/')[2]
    }
    else {
        hostname = url.split('/')[0]
    }

    //find & remove port number
    hostname = hostname.split(':')[0]
    //find & remove "?"
    hostname = hostname.split('?')[0]

    return hostname
  }

  function getTitle( params ) {
    if( params.meta_title ) {
      return params.meta_title
    }
    return params.title
  }

</script>