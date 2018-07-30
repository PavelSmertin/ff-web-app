 <template>
  <article 
    v-observe-visibility="( isVisible, entry ) => visibilityChanged( isVisible, entry, post.id, post.slug )" 
    class="ff-post" 
    itemscope itemtype="http://schema.org/NewsArticle"
    >

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
        <li class="post_detail_coins">
          <span v-for="coin of post.coins" v-bind:key="coin.id" class="coin_tag">
            {{ coin.symbol }}
          </span>
        </li>
        <li >
          <timeago :since="post.create_dt" class="time-ago"></timeago>    
          <meta itemprop="datePublished" v-bind:content="post.create_dt">
        </li>
        <li v-if="post.type == 'news'">Новость</li>
        <li v-else-if="post.type == 'prognosis'">Прогноз</li>
        <li v-if="sourceDomain()" class="post_detail_source ff-label">
          Источник: <span itemprop="isBasedOn" >{{ sourceDomain() }}</span>
        </li>
      </ul>
    </div>
    
    <h1 class="post-header" itemprop="headline" >
      {{ post.title }}
    </h1>

    <span v-if="getImageOriginal()" itemprop="image" itemscope itemtype="https://schema.org/ImageObject">
      <img class="image_origin" v-bind:itemprop="getImageOriginal()" v-bind:alt="seoTitle" v-bind:title="seoTitle" :src="getImageOriginal()"/>
    </span>

    <div itemprop="articleBody" v-html="post.body" class="description"></div>

    <div class="tools">
      <div class="post_author" itemprop="isBasedOn">
      </div>
      <div class="social">

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

    <div class="tools">

      <div class="tools_left">
        <button class="vote vote_up" v-on:click="vote(1)">
          <span class="ic_up"></span><span class="votes_count">{{ post.votes_positive }}</span>
        </button>
        <button class="vote vote_down" v-on:click="vote(0)">
          <span class="ic_down"></span><span class="votes_count">{{ post.votes_negative }}</span>
        </button>
      </div>

      <div class="tools_right">
        <button class="vote like" v-on:click="like(1)">
          <span class="ic_like"></span><span class="votes_count">{{ post.likes_positive }}</span>
        </button>
        <button class="vote dislike" v-on:click="like(0)">
          <span class="ic_dislike"></span><span class="votes_count">{{ post.likes_negative }}</span>
        </button>
      </div>

    </div>

    <div v-if="postCoin()" class="tools">
      <div class="tools_left">
        <button class="watch" v-on:click="watch()">
          <span class="button_icon ic_star" v-bind:class="activeFavourite"></span><span class="button_body">Отслеживать {{ postCoin() }}</span>
        </button>
      </div>
      <div class="tools_right">
        <button class="subscribe" v-on:click="subscribe()">
          <span v-if="inSubscribed()" >Подписаться на {{ postCoin() }}</span>
          <span v-else>Отписаться от {{ postCoin() }}</span>
        </button>
      </div>
    </div>


    <div v-if="first == post.id" class="my-widget-anchor mail_news_widget" id="mailru_widget" data-cid="b9cdb3b43490823a65345cb4608d6471"></div>

  </article>
</template>

<script>

  import BaseNetworks from '@/assets/networks.json'
  import PostItemRelated from '~/components/PostItemRelated.vue'
  import Vue from 'vue'
  import Jsona from 'jsona'

  const dataFormatter = new Jsona()

  export default {
    name: 'post-item',

    props: {
      postProp: 0,
      first: 0,
    },

    components: {
      PostItemRelated
    },

    data() {
      return {
        url: process.env.baseUrl + this.$route.path,
        title: '',
        seoTitle: getTitle( this.postProp ),        
        body: '',
        overriddenNetworks: BaseNetworks,
        post: this.postProp
      }
    },

    mounted () {
      if( this.first == this.post.id ) {
        this.injectRecomendedWidget()
      }
      this.initRelationNews();
    },

    computed: {
      activeFavourite: function () {
        return {
          'active_star': this.inFavourites()
        }
      },
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
        if( this.setLocalStorage( "vote_" + this.post.id, is_positive )) {
          return
        }
        this.$axios.post(`/api/news/${ this.post.id }/vote?include=coins`, `is_positive=${is_positive}&type=rating`)
          .then(({ data }) => {
            this.post = dataFormatter.deserialize( data )
          }).catch(e => {
            if (e.response && e.response.status == 401) {
              this.$router.push({ name: `account-signin` })
            }
          })
      },

      like( is_positive ) {
        if( this.setLocalStorage( "like_" + this.post.id, is_positive )) {
          return
        }
        this.$axios.post(`/api/news/${ this.post.id }/vote?include=coins`, `is_positive=${is_positive}&type=like`)
          .then(({ data }) => {
            this.post = dataFormatter.deserialize( data )
          }).catch(e => {
            if (e.response && e.response.status == 401) {
              this.$router.push({ name: `account-signin` })
            }
          })
      },

      setLocalStorage( key, is_positive ) {
        if (typeof localStorage === 'undefined' ) {
          return true
        }
        if ( process.server ) {
          return true
        }
        if( this.$auth.loggedIn ) {
          return true
        }
        const value = localStorage.getItem( key )

        if( value != null && value != undefined ) { // && value == is_positive ) {
          return true
        }

        localStorage.setItem( key, is_positive )

        return false
      },

      watch() {
        this.$axios.post(`/api/coin/favorite?include=favoritecoins`, `symbol=${ this.postCoin() }`)
          .then(({ data }) => {
            let response = dataFormatter.deserialize( data )
            this.$store.commit('SET_FAVORITE_COINS', response.favoritecoins)
          }).catch(e => {
            if (e.response && e.response.status == 401) {
              this.$router.push({ name: `account-signin` })
            }
          })
      },

      subscribe() {
        this.$axios.post(`/api/coin/subscribe?include=subscribedcoins`, `symbol=${ this.postCoin() }`)
          .then(({ data }) => {
            let response = dataFormatter.deserialize( data )
            this.$store.commit('SET_SUBSCRIBED_COINS', response.subscribedcoins)
          }).catch(e => {
            if (e.response && e.response.status == 401) {
              this.$router.push({ name: `account-signin` })
            }
          })
      },

      visibilityChanged( isVisible, entry, postId, slug ) {
        if( isVisible ) {

          //this.$router.replace({path: '/' + postId})
          let path = '/' + postId + (slug ? '/' + slug : '')

          if( window.location.pathname !=  path ) {
            window.history.pushState({}, null, path )
            if( process.env.NODE_ENV !== 'production' ) {
              return
            }

            yaCounter25598768.hit( path )
            ga('set', 'page', path)
            ga('send', 'pageview')
          }
        } 
      },

      injectRecomendedWidget() {
        if( document.getElementById("my-widget-script") ) {
          myWidget.render('b9cdb3b43490823a65345cb4608d6471', document.getElementById("mailru_widget"));
          return
        }

        var script = document.createElement("script");
        script.appendChild(document.createTextNode('window.myWidgetInit = {useDomReady: true};(function(d, s, id) {var js, t = d.getElementsByTagName(s)[0];if (d.getElementById(id)) return;js = d.createElement(s); js.id = id;js.src = "https://likemore-go.imgsmail.ru/widget.js";t.parentNode.insertBefore(js, t);}(document, "script", "my-widget-script"));'));
        document.body.appendChild(script);
      },

      initRelationNews() {
        const PostItemComponentClass = Vue.extend(PostItemRelated)

        if (this.post.relatednews) {
          this.post.relatednews.forEach(function(news, i, arr){
            let instance = new PostItemComponentClass({
              propsData: { newest: news }
            })
            instance.$mount('#ffrel_' + news.id)
          })
        }
      },

      postCoin() {
        if( this.post.coins && this.post.coins.length > 0 ) {
          return this.post.coins[0].symbol
        } 
        return null
      },

      inFavourites() {
        return this.$store.state.favoriteCoins && this.$store.state.favoriteCoins.find( coin =>  coin.symbol == this.postCoin() )
      },

      inSubscribed() {
        return this.$store.state.subscribedCoins && this.$store.state.subscribedCoins.find( coin =>  coin.symbol == this.postCoin() )
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