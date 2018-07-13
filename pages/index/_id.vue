<template>
  <article class="ff-post">

<!--     <ul class="ff_post_tabs">
      <li class="col-12">
        <span>К другим новостям</span>
      </li>
    </ul> -->
    <div class="news-detail">
      <ul class="ff-label news_list_detail">
        <li><timeago :since="attributes.create_dt" class="time-ago"></timeago></li>
        <li v-if="attributes.type == 'news'">Новость</li>
        <li v-else-if="attributes.type == 'prognosis'">Прогноз</li>
      </ul>
    </div>
    
    <h1 class="post-header">
      {{ attributes.title }}
    </h1>

    <img v-if="getImageOriginal()" class="image_origin" :src="getImageOriginal()" v-bind:alt="seoTitle">

    <div v-html="attributes.body" class="description"></div>
    <div class="post_source ff-label">
        Источник: {{ sourceDomain() }}
    </div>
    <div class="tools">

      <button class="vote_up" v-on:click="vote(1)">
        <span class="ic_up"></span><span class="votes_count">{{ attributes.votes_positive }}</span>
      </button>
       <button class="vote_down" v-on:click="vote(0)">
        <span class="ic_down"></span><span class="votes_count">{{ attributes.votes_negative }}</span>
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

    <div class="my-widget-anchor mail_news_widget" id="mailru_widget" data-cid="b9cdb3b43490823a65345cb4608d6471"></div>

  </article>


</template>

<script>
import Vue from 'vue'
import BaseNetworks from '@/assets/networks.json';

var MINUTE = 60;
var HOUR = MINUTE * 60;
var DAY = HOUR * 24;
var WEEK = DAY * 7;
var MONTH = DAY * 30;
var YEAR = DAY * 365;

export default {

  transition: 'page',

  validate({ params }) {
    return !isNaN(+params.id)
  },


  data() {
    var title = "Новости Bitcoin (BTC) на FF.ru";
    var seoTitle = "Новости Bitcoin (BTC) на FF.ru";
    return {
      showSocial: false,
      url: process.env.baseUrl + this.$route.path,
      title: title,
      seoTitle: title,
      body: '',
      overriddenNetworks: BaseNetworks,
    }
  },

  async asyncData({ app, req, params, error, redirect, route }) {

    // if( process.client && params.newest) {
    //   return {
    //     url: process.env.baseUrl + "/" + params.newest.id,
    //     title: params.newest.title,
    //     seoTitle: getTitle(params.newest),
    //     body: params.newest.body,
    //     attributes: params.newest,
    //   }
    // }
    try {
      const { data } = await app.$axios.get(`/api/news/view/${+params.id}`)
 
      if( redirectToSlug(data.data.attributes.slug, params.slug) ) {
        redirect(301, { path: `/${+params.id}/${data.data.attributes.slug}` })
      } else {
        return {
          url: process.env.baseUrl +  "/" + data.data.id,
          title: data.data.attributes.title,
          seoTitle: getTitle(data.data.attributes),
          body: data.data.attributes.body,
          attributes: data.data.attributes,
        }
      }
    } catch (e) {
      if( e.response && e.response.status == 404 ) {
        error({ message: 'Newest not found', statusCode: 404 })
      }
    }
  },

  head() {
    return {
      title: this.seoTitle,
      meta: [
        { 
          hid: 'description', 
          name: 'description', 
          content: strip_social_desription(this.body, 200),
        },
        { hid: 'og:type', property: 'og:type', content: 'article' },
        { property: 'article:published_time', content: '' },
        { hid: 'og:title', property: 'og:title', content: this.title },
        { hid: 'og:url', property: 'og:url', content: process.env.baseUrl + this.$route.path },
        { hid: 'og:image', property: 'og:image', content: process.env.baseUrl + this.getImageSharing() },
        { hid: 'og:description', property: 'og:description', content: strip_social_desription(this.body, 200) },
        { hid: 'twitter:title',name: 'twitter:title', content: this.title },
        { hid: 'twitter:description', name: 'twitter:description', content: strip_social_desription(this.body, 200) },
        { hid: 'twitter:image', name: 'twitter:image', content: process.env.baseUrl + this.getImageSharing() },

      ],
    }
  },

  mounted () {
    this.$on('social_shares_open', function (network, url) {
    });
    this.showSocial = true // showLine will only be set to true on the client. This keeps the DOM-tree in sync.
    this.goto()


    this.injectMailCollector()
    this.injectRecomendedWidget()

  },

  computed: {
    stripSocialDesription: function() {
      var str = this.attributes.body
      if ((str === null) || (str === ''))
        return false;
      else
        str = str.toString();
      return str.replace(/<[^>]*>/g, '');
    }
  },
  methods: {
    goto() {
        var element = this.$parent.$refs["scroll-container"];
        element.scrollTo(0, 0);
    },
    open( ) {
      console.log('open ')
    },
    change( network ) {
      console.log('change ')
    },
    close( network ) {
      console.log('close ')
    },
    sourceDomain() {
      var domain = extractHostname(this.attributes.source_url),
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
      if( this.attributes.images.sharing ) {
        return '/images' + this.attributes.images.sharing
      }
      return '/FF_cover1080_b.png'
    },
    getImageOriginal() {
      if( this.attributes.images.original ) {
        return '/images' + this.attributes.images.original
      }
      return false
    },
    vote(is_positive) {
      this.$axios.post(`/api/news/${this.attributes.id}/vote`, `is_positive=${is_positive}`)
        .then(({ data }) => {
          this.attributes = data.data.attributes
        }).catch(e => {
          if (e.response && e.response.status == 401) {
            this.$router.push({ name: `account-signin` })
          }
        })
    },

    injectMailCollector() {

      if(document.getElementById("inject_mail_collector")) {
        return
      }

      var chimpPopupWrap = document.createElement('script');
      chimpPopupWrap.src = "//downloads.mailchimp.com/js/signup-forms/popup/embed.js"
      chimpPopupWrap.setAttribute('data-dojo-config', 'usePlainJson: true, isDebug: false');
      chimpPopupWrap.id = "inject_mail_collector";


      document.body.appendChild(chimpPopupWrap);

      var chimpPopup = document.createElement("script");
      chimpPopup.appendChild(document.createTextNode('require(["mojo/signup-forms/Loader"], function (L) { L.start({"baseUrl":"mc.us18.list-manage.com","uuid":"f2a6cbc588ae02f3e4991dd3d","lid":"c84e62e0f7"})});'));

      chimpPopupWrap.onload = function() {
        document.body.appendChild(chimpPopup);
      }


    },

    injectRecomendedWidget() {

      if(document.getElementById("my-widget-script")) {
        myWidget.render('b9cdb3b43490823a65345cb4608d6471', document.getElementById("mailru_widget"));
        return
      }

      var script = document.createElement("script");
      script.appendChild(document.createTextNode('window.myWidgetInit = {useDomReady: true};(function(d, s, id) {var js, t = d.getElementsByTagName(s)[0];if (d.getElementById(id)) return;js = d.createElement(s); js.id = id;js.src = "https://likemore-go.imgsmail.ru/widget.js";t.parentNode.insertBefore(js, t);}(document, "script", "my-widget-script"));'));
      document.body.appendChild(script);
    }
  },
}


function redirectToSlug(data, slug) {
  // Переход по ссылке со slug
  if( slug && data && slug == data ) {
    return false
  } 

  // Переход по ссылке без slug
  if( !slug && !data ) {
    return false
  }

  // Редирект на slug
  if( !slug ) {
    return true
  } 

  throw new Error('Newest not found');
}

function strip_social_desription(str, desriptionLength) {
  if ((str===null) || (str===''))
    return false;
  else
    str = str.toString();
  return str.replace(/<[^>]*>/g, '').substring(0, desriptionLength) + "...";
}


function open( network ) {
  console.log('open1 ')
}
function change( network ) {
  console.log('change1 ')
}
function close( network ) {
  console.log('close1 ')
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

function getTitle( params ) {
  if( params.meta_title ) {
    return params.meta_title
  }
  return params.title
}

function formatDate( dateString ) {
  let postDate = new Date(dateString)
  let dd    = postDate.getDate()
  let mm    = postDate.getMonth()+1 //January is 0!
  let yyyy  = postDate.getFullYear()
  let yy    = postDate.getYear()
  if( dd < 10 ){
    dd = '0' + dd
  } 
  if( mm < 10 ){
    mm ='0' + mm
  }
  if( yyyy >= 2000 ){
    yy = yy - 100
  } else {
    yy = yyyy
  }

  return `${dd}.${mm}.${yy}`
}

</script>