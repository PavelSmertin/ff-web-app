 <template>
  <article 
    v-observe-visibility="( isVisible, entry ) => visibilityChanged( isVisible, entry, post )" 
    class="ff_post" 
    itemscope itemtype="http://schema.org/NewsArticle"
    >

    <!-- Ссылка на статью -->
    <link itemprop="mainEntityOfPage" itemscope v-bind:href="url">
 
    <!-- Данные о сайте: лого, телефон, адрес, название -->
    <div itemprop="publisher" itemscope itemtype="https://schema.org/Organization">
      <div itemprop="logo" itemscope itemtype="https://schema.org/ImageObject">
        <meta itemprop="url" :content="host + '/logo77.png'">
        <meta itemprop="width" content="77">
        <meta itemprop="height" content="77">
      </div>
      <meta itemprop="name" content="ff.ru">
    </div>

    <div class="sticky_block">
      <div class="sticky_inner">
        <button 
          class="vote vote_up" 
          v-on:click="vote(1)"
          v-on:mouseover="mouseOverVoteUp"
          v-on:mouseleave="mouseLeave"
          >
          <span class="ic_up"></span><span class="votes_count">{{ post.votes_positive }}</span>
        </button>
        <button 
          class="vote vote_down" 
          v-on:click="vote(0)"
          v-on:mouseover="mouseOverVoteDown"
          v-on:mouseleave="mouseLeave"
          >
          <span class="ic_down"></span><span class="votes_count">{{ post.votes_negative }}</span>
        </button>
        <button 
          class="vote like" 
          v-on:click="like(1)"
          v-on:mouseover="mouseOverLike"
          v-on:mouseleave="mouseLeave"
          >
          <span class="ic_like"></span><span class="votes_count">{{ post.likes_positive }}</span>
        </button>
        <button
          class="vote dislike"
          v-on:click="like(0)"
          v-on:mouseover="mouseOverDislike"
          v-on:mouseleave="mouseLeave"
          >
          <span class="ic_dislike"></span><span class="votes_count">{{ post.likes_negative }}</span>
        </button>

      </div>

      <transition name="tooltip">
        <div v-if="showTooltip" class="ff_tooltip" v-bind:class="buttonColor">
          {{ tooltipText }}
        </div>
      </transition>
    </div>

   
    <div class="news-detail">
      <ul class="ff_label news_list_detail">
        <li v-if="post.coins && post.coins.length > 0" class="post_detail_coins">
          <span v-for="coin of post.coins" v-bind:key="coin.id" class="coin_tag">
            {{ coin.symbol }}
          </span>
        </li>
        <li v-if="post.is_top !== true">
          <timeago :since="post.create_dt" class="time-ago"></timeago>    
          <meta itemprop="datePublished" v-bind:content="post.create_dt">
        </li>
        <li>{{ postType() }}</li>

        <li v-if="sourceDomain()" class="post_detail_source ff_label">
          Источник: <a :href="post.source_url" itemprop="isBasedOn" rel="nofollow noopener" target="_blank">{{ sourceDomain() }}</a>
        </li>

      </ul>
    </div>

    <h1 class="post_header" itemprop="headline" >
      {{ post.title }}
    </h1>

    <div class="image_origin_wrap" v-if="getImageOriginal()">
      <img class="image_origin" v-bind:alt="post.title" v-bind:title="post.title" :src="getImageOriginal()" itemprop="image" />
    </div>
    <meta v-else itemprop="image" :content="host + '/FF_cover968_b.png'" >

    <div v-if="post.type == 'prognosis'" class="buy_coin">
      <div v-if="isActiveCoin(coin.symbol)" v-for="coin of post.coins" v-bind:key="coin.id" class="buy_coin_item">
        <div class="cost">Стоимость {{ getCase(coin, 2) }} на сегодня<br/><b>${{ coin.price_usd }}</b></div>
        <div class="btn">
          <nuxt-link :to='coinBuyUrl( coin.symbol )' class="button_buy_coin">Купить {{ coin.symbol }}</nuxt-link>
        </div>
      </div>
    </div>

    <div itemprop="articleBody" v-html="post.body" v-twitter-widgets class="description"></div>

    <div class="tools">
      <!-- Автор статьи -->
      <div v-if="post.type != 'signals' && post.author !== undefined" class="post_author" itemprop="author" itemscope itemtype="http://schema.org/Person">
        Перевод: <nuxt-link :to="{ path: '/authors' }" itemprop="name">{{ post.author.full_name }}</nuxt-link>
      </div>
      <div class="social">

        <social-sharing :networks="overriddenNetworks"
                      :url="url"
                      :title="post.title"
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


    <div v-if="postCoin()" class="tools">
      <div class="tools_right">
        <button class="subscribe" v-on:click="subscribe()">
          <span v-if="inSubscribed()" >Отписаться от {{ postCoin() }}</span>
          <span v-else>Подписаться на {{ postCoin() }}</span>
        </button>
      </div>
    </div>

    <div class="comments">
      <div class="comments_head">Комментарии {{ commentsCount }}</div>

      <comment v-for="comment of comments" v-bind:key="comment.id" :comment="comment"></comment>

      <comment v-for="newComment of newComments" v-bind:key="newComment.id" :comment="newComment"></comment>

      <div class="comment_footer">
        <input type="text" name="comment" autocomplete="off" v-model="commentText" v-on:keyup.enter="sendComment()" placeholder="Написать комментарий" />
        <input type="button" value="Отправить" v-on:click="sendComment()" :disabled="commentsButtonDisabled" />
      </div>
    </div>

    <a class="tt_banner_wrap" href="https://tt.ff.ru" rel="noopener" alt="trader trends">
      <img src="/tt_banner.png" class="tt_banner" alt="tt_banner" >
    </a>

    <div class="tg_banner_wrap">
      <div class="tg_banner">
        <div class="tg_banner_icon">
          <span class="banner_icon"></span>
        </div>
        <div class="tg_banner_body">
          <p class="ff_nc_title">Подпишитесь на наш Телеграм канал</p>
          <p>Инсайдерские новости.  Обучающие материалы. Прогнозы курсов криптовалют</p>
        </div>
        <a 
          @click.native="onSocialClick('tg')" 
          href="https://telegram.im/@FF_RUS?lang=ru" 
          class="subscribe tg" 
          alt="tg" 
          target="_blank">
            <span class="banner_icon"></span>Подписаться
        </a>
      </div>
    </div>

    <div v-if="post.similar && post.similar.length > 0" class="similar_list_wrap">
      <h3>Похожие публикации</h3>
      <div class="similar_list">
        <post-similar v-for="item of post.similar" v-bind:key="item.id" :post="item"></post-similar>
      </div>
    </div>
  </article>
</template>

<script>

  import BaseNetworks from '@/assets/networks.json'
  import PostItemRelated from '~/components/PostItemRelated.vue'
  import PostSimilar from '~/components/PostSimilar.vue'
  import Comment from '~/components/Comment.vue'
  import Vue from 'vue'
  import { analMixin } from '~/components/mixins/analitics.js'
  import { indacoinMixin } from '~/components/mixins/indacoin.js'

  const TOOLTIP_UP_TYPE = 'tooltip_up_type'
  const TOOLTIP_DOWN_TYPE = 'tooltip_down_type'
  const TOOLTIP_LIKE_TYPE = 'tooltip_like_type'
  const TOOLTIP_DISLIKE_TYPE = 'tooltip_dislike_type'

  export default {

    mixins: [ analMixin, indacoinMixin ],

    props: {
      postProp: 0,
      comments: null,
      commentsCount: 0
    },

    components: {
      PostItemRelated,
      Comment,
      PostSimilar,
    },

    data() {
      return {
        url: process.env.baseUrl + this.$route.path,
        body: '',
        overriddenNetworks: BaseNetworks,
        post: this.postProp,
        host: process.env.baseUrl,
        commentText: '',
        newComments: [],
        commentsSendProcess: false,
        showTooltip: false,
        tooltipText: null,
        tooltipType: null,
      }
    },

    mounted () {
      this.initRelationNews();
      this.addClickImageListener();
    },

    computed: {
      stripSocialDesription: function() {
        var str = this.post.body
        if ((str === null) || (str === ''))
          return false;
        else
          str = str.toString();
        return str.replace(/<[^>]*>/g, '')
      },
      commentsButtonDisabled: function () {
        return this.commentText.length < 1 || this.commentsSendProcess === true;
      },

      buttonColor: function () {
        return {
          'vote_up_style': this.tooltipType == TOOLTIP_UP_TYPE,
          'vote_down_style': this.tooltipType == TOOLTIP_DOWN_TYPE,
        }
      }
    },

    methods: {
      sourceDomain() {
        var domain = extractHostname(this.post.source_url)

        if( !domain ) {
          return false
        }

        var splitArr = domain.split('.'),
            arrLen = splitArr.length

        // extracting the root domain here
        // if there is a subdomain 
        if (arrLen > 2) {
          domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1]
          // check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
          if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
            // this is using a ccTLD
            domain = splitArr[arrLen - 3] + '.' + domain
          }
        }
        return domain
      },

      open() {
      },

      getImageOriginal() {
        if( this.post.images.original ) {
          return '/images' + this.post.images.original
        }
        return false
      },

      vote( is_positive ) {
        this.sendEvent( 'PostVote', 'vote', is_positive );

        if( this.setLocalStorage( "vote_" + this.post.id, is_positive )) {
          return
        }
        this.$axios.post(`/api/news/${ this.post.id }/vote?include=relatednews,coins,similar,author`, `is_positive=${is_positive}&type=rating`)
          .then(({ data }) => {
            this.post = this.$dataFormatter.deserialize( data )
          }).catch(e => {
            if (e.response && e.response.status == 401) {
              this.$router.push({ name: `account-signin` })
            }
          })
      },

      like( is_positive ) {
        this.sendEvent( 'PostLike', 'like', is_positive );

        if( this.setLocalStorage( "like_" + this.post.id, is_positive )) {
          return
        }
        this.$axios.post(`/api/news/${ this.post.id }/vote?include=relatednews,coins,similar,author`, `is_positive=${is_positive}&type=like`)
          .then(({ data }) => {
            this.post = this.$dataFormatter.deserialize( data )
          }).catch(e => {
            if (e.response && e.response.status == 401) {
              this.$router.push({ name: `account-signin` })
            }
          })
      },

      mouseOverVoteUp( event ) {
        this.showTooltip = true
        this.tooltipType = TOOLTIP_UP_TYPE
        this.tooltipText = 'Проголосуйте, если эта новость сигнализирует о положительном влиянии на цену'
      },
      mouseOverVoteDown( event ) {
        this.showTooltip = true
        this.tooltipType = TOOLTIP_DOWN_TYPE
        this.tooltipText = 'Проголосуйте, если эта новость сигнализирует об отрицательном влиянии на цену'
      },
      mouseOverLike( event ) {
        this.showTooltip = true
        this.tooltipType = TOOLTIP_LIKE_TYPE
        this.tooltipText = 'Проголосуйте, если вам нравится эта новость'
      },
      mouseOverDislike( event ) {
        this.showTooltip = true
        this.tooltipType = TOOLTIP_DISLIKE_TYPE
        this.tooltipText = 'Проголосуйте, если вам не нравится эта новость'
      },

      mouseLeave() {
        this.showTooltip = false
      },

      setLocalStorage( key, is_positive ) {
        if( typeof localStorage === 'undefined' ) {
          return true
        }

        if( process.server ) {
          return true
        }

        if( this.$auth.loggedIn ) {
          localStorage.setItem( key, is_positive )
          return false
        }

        const value = localStorage.getItem( key )
        if( value != null && value != undefined ) { // && value == is_positive ) {
          return true
        }
        localStorage.setItem( key, is_positive )

        return false
      },

      subscribe() {
        this.sendEvent( 'PostCoinSubscribe', 'subscribe', this.postCoin() );

        this.$axios.post(`/api/coin/subscribe?include=subscribedcoins`, `symbol=${ this.postCoin() }`)
          .then(({ data }) => {
            let response = this.$dataFormatter.deserialize( data )
            this.$store.commit('SET_SUBSCRIBED_COINS', response.subscribedcoins)
          }).catch(e => {
            if (e.response && e.response.status == 401) {
              this.$router.push({ name: `account-signin` })
            }
          })
      },

      visibilityChanged( isVisible, entry, post ) {

        if( isVisible ) {

          //this.$router.replace({path: '/' + postId})
          let path = '/' + post.id + ( post.slug ? '/' + post.slug : '' )

          if( window.location.pathname !=  path ) {
            window.history.pushState({}, null, path )
            this.seoTitle = post.title
            this.$emit('post-visible', post.title)
            if( process.env.NODE_ENV !== 'production' ) {
              return
            }

            yaCounter25598768.hit( path )
            ga('set', 'page', path)
            ga('send', 'pageview')
          }
        } 
      },

      initRelationNews() {
        const PostItemComponentClass = Vue.extend(PostItemRelated)

        if( this.post.relatednews ) {
          this.post.relatednews.forEach( function( post, i, arr ){
            let instance = new PostItemComponentClass({
              propsData: { newest: post }
            })
            instance.$mount('#ffrel_' + post.id)
          })
        }
      },

      postCoin() {
        if( this.post.coins && this.post.coins.length > 0 ) {
          return this.post.coins[0].symbol
        } 
        return null
      },

      inSubscribed() {
        return this.$store.state.subscribedCoins && this.$store.state.subscribedCoins.find( coin =>  coin.symbol == this.postCoin() )
      },

      sendComment() {
        this.commentsSendProcess = true
        this.$axios.post( `/api/news/${this.post.id}/add-comment?include=user`, `parent_id=0&comment=${this.commentText}`)
            .then( ({ data }) => {
              let commentObj = this.$dataFormatter.deserialize( data )
              this.newComments.push(commentObj)
              this.commentsSendProcess = false
              this.commentText = ''
              this.commentsCount++
            })
            .catch(function (error) {
              this.showMessage("Не удалось добавить комментарий")
              this.commentsSendProcess = false
            })
      },

      onSocialClick: function ( network ) {
        this.sendEvent( 'SocialPost', 'click', network );
      },

      addClickImageListener: function () {
          let articles = document.getElementsByTagName('article')
          if (articles) {
              for (let aItem = 0; aItem < articles.length; aItem++) {
                  let imgs = articles.item(aItem).getElementsByClassName("description").item(0).getElementsByTagName('img')
                  for (let imgItem = 0; imgItem < imgs.length; imgItem++) {
                      let img = imgs.item(imgItem);
                      let handle = {
                          img: img,
                          handleEvent: function(){

                              let showImgContainer = document.createElement('div')
                              showImgContainer.setAttribute('id', 'showImgContainer')

                              let showImgBgr = document.createElement('div')
                              showImgBgr.setAttribute('id', 'showImgBgr')
                              showImgContainer.addEventListener('click', {
                                  showImgBgr: showImgBgr,
                                  showImgContainer: showImgContainer,
                                  handleEvent: function(){
                                      this.showImgBgr.remove()
                                      this.showImgContainer.remove()
                                  }
                              }, false)

                              let image = document.createElement('img')
                              image.src = this.img.getAttribute('src')

                              showImgContainer.appendChild(image)

                              document.body.appendChild(showImgBgr)
                              document.body.appendChild(showImgContainer)
                          }
                      }

                      if (!img.getAttribute('scl')) {
                          if (img.addEventListener) {
                              img.addEventListener('click', handle, false);
                          }
                          else if (img.attachEvent) {
                              img.attachEvent('onclick', handle);
                          }
                          else {
                              img['onclick'] = handle;
                          }
                          img.setAttribute('scl', 'true');
                      }

                  }
              }
          }
      },

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

      getCase(coin) {
          return getCase(coin, 2)
      },

      coinName: function(coin, variant) {
        if(variant === 2) {
          if(coin.cases && coin.cases.ro) {
              return coin.cases.ro
          }
        }

        if(coin.cases && coin.cases.im) {
          return coin.cases.im
        }

        return coin.coin_name
      }

    }
  }

  function extractHostname( url ) {

    if( url == null || url == undefined ) {
      return false
    }

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

  function getCase (params, variant) {
      if(variant == 2) {
          if(params.cases && params.cases.ro) {
              return params.cases.ro
          }
      }

      if(params.cases && params.cases.im) {
          return params.cases.im
      }

      return params.coin_name
  }

</script>