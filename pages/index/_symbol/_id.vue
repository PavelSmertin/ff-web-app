<template>
  <div class="ff_post_feed">
    <nuxt-link 
      class="ff_post_banner" :to="coinBuyUrl( 'BTC' )"
      @click.native="sendEvent( 'NewsBanner', 'click', 'Баннер вверху' )" 
      >
      <img src="/banner_728x90.png" alt="banner">
    </nuxt-link>

    <post v-for="post of news" v-on:post-visible="seoTitle = $event" v-bind:key="post.id" :postProp="post" :comments="post.comments" :commentsCount="post.comments ? post.comments.length : 0" ></post>
    <div ref="infinite_loading_container"></div>
  </div>
</template>

<script>
  import Post from '~/components/Post.vue'
  import { analMixin } from '~/components/mixins/analitics.js'
  import { indacoinMixin } from '~/components/mixins/indacoin.js'

  const api_news = '/api/news?per-page=1&include=relatednews,coins,similar,author,comments,is_top'

  export default {

    mixins: [ analMixin, indacoinMixin ],

    validate({ params }) {
      return !isNaN(+params.id)
    },

    data() {
      return {
        url: process.env.baseUrl + this.$route.path,
        meta: { current_page: 0 },

        scrollParent: null,
        scrollHandler: null,
        isLoading: false,
        isComplete: false,
        isFirstLoad: true, // save the current loading whether it is the first loading
        debounceTimer: null,
        debounceDuration: 50,
        distance: 6000,
        comments: [],
        commentsCount: 0,
    }
  },

    components: {
      Post,
    },

    async asyncData({ app, req, params, error, redirect, route, store }) {
      try {
        const { data } = await app.$axios.get(`/api/news/view/${+params.id}?include=relatednews,coins,similar,author,comments`)

        if( redirectToSlug(data.data.attributes.slug, params.slug) ) {
          redirect(301, { path: `/${+params.id}/${data.data.attributes.slug}` })
        } else {

          return {
            url:        process.env.baseUrl +  "/" + data.data.id,
            title:      data.data.attributes.title,
            seoTitle:   getTitle(data.data.attributes),
            body:       data.data.attributes.body,
            attributes: data.data.attributes,
            news:       [ app.$dataFormatter.deserialize( data ) ],
          }

        }
      } catch (e) {
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
          { property: 'article:published_time', content: this.attributes.create_dt },
          { hid: 'og:title', property: 'og:title', content: this.title },
          { hid: 'og:url', property: 'og:url', content: process.env.baseUrl + this.$route.path },
          { hid: 'og:image', property: 'og:image', content: process.env.baseUrl + this.getImageSharing() },
          { hid: 'og:description', property: 'og:description', content: strip_social_desription(this.body, 200) },
          { hid: 'twitter:title',name: 'twitter:title', content: this.title },
          { hid: 'twitter:description', name: 'twitter:description', content: strip_social_desription(this.body, 200) },
          { hid: 'twitter:image', name: 'twitter:image', content: process.env.baseUrl + this.getImageSharing() },
        ],
        link: [
          { rel: 'canonical', href: this.canonical() }
        ]
      }
    },

    mounted () {

      this.scrollParent = this.getScrollParent()

      this.goto()

      this.scrollHandler = function scrollHandlerOriginal(ev) {
        if (!this.isLoading) {
          clearTimeout(this.debounceTimer)

          if (ev && ev.constructor === Event) {
            this.debounceTimer = setTimeout(this.attemptLoad, this.debounceDuration)
          } else {
            this.attemptLoad()
          }
        }
      }.bind( this )

      setTimeout( this.scrollHandler, 1 )
      this.scrollParent.addEventListener( 'scroll', this.scrollHandler )

      this.$on('$InfiniteLoading:loaded', (ev) => {
        this.isFirstLoad = false
        if (this.isLoading) {
          this.$nextTick(this.attemptLoad.bind( null, true ))
        }
      });

      this.$on('$InfiniteLoading:complete', (ev) => {
        this.isLoading = false
        this.isComplete = true
        // force re-complation computed properties to fix the problem of get slot text delay
        this.$nextTick(() => {
          this.$forceUpdate()
        })
        this.scrollParent.removeEventListener( 'scroll', this.scrollHandler )
      });

      this.$on('$InfiniteLoading:reset', () => {
        this.isLoading = false
        this.isComplete = false
        this.isFirstLoad = true
        this.scrollParent.addEventListener( 'scroll', this.scrollHandler )
        setTimeout(this.scrollHandler, 1)
      });

      this.stateChanger = {
        loaded: () => {
          this.$emit( '$InfiniteLoading:loaded', { target: this } )
        },
        complete: () => {
          this.$emit( '$InfiniteLoading:complete', { target: this } )
        },
        reset: () => {
          this.$emit( '$InfiniteLoading:reset', { target: this } )
        },
      };

    },

    methods: {
      goto() {
          var element = this.scrollParent
          element.scrollTo(0, 0)
      },
      getImageSharing() {
        if( this.attributes.images.sharing ) {
          return '/images' + this.attributes.images.sharing
        }
        return '/FF_cover968_b.png'
      },
      getScrollParent() {
        return this.$parent.$parent.$refs["scroll-container"]
      },
      attemptLoad( isContinuousCall ) {
        if( this.$refs["infinite_loading_container"] == undefined) {
          return
        }
        const currentDistance = this.getCurrentDistance();

        if( !this.isComplete && currentDistance <= this.distance &&
          (this.$el.offsetWidth + this.$el.offsetHeight) > 0 ) {
          this.isLoading = true
          this.infiniteHandler()
        } else {
          this.isLoading = false
        }
      },
      getCurrentDistance() {
        const infiniteElmOffsetTopFromBottom = this.$refs["infinite_loading_container"].getBoundingClientRect().top
        const scrollElmOffsetTopFromBottom = this.scrollParent === window ?
          window.innerHeight :
          this.scrollParent.getBoundingClientRect().bottom
        return infiniteElmOffsetTopFromBottom - scrollElmOffsetTopFromBottom
      },
      infiniteHandler() {
        this.$axios.get(apiNewsPrepare(this.$store.state.filters), {
          params: {
            page: this.meta.current_page + 1,
          },
        }).then(({ data }) => {
          if (this.meta.current_page < data.meta.page_count) {
            this.meta = data.meta
            let news = this.$dataFormatter.deserialize( data )
            this.concatNews( news )
            this.isLoading = false
            this.stateChanger.loaded()
            this.sendEvent( 'NewsFeedLoading', 'loadPage', this.meta.current_page );
          } else {
            this.stateChanger.complete()
          }
        });
      },
      concatNews( news ) {
        this.news = this.news.concat( news.filter( post => this.news.find( current => current.id == post.id  ) == undefined ))
      },
      canonical() {
        let path = this.attributes.id + ( this.attributes.slug ? '/' + this.attributes.slug : '' )
        return process.env.baseUrl + '/' + path
      }
    },

    deactivated() {
      this.isLoading = false;
      this.scrollParent.removeEventListener('scroll', this.scrollHandler);
    },
    activated() {
      this.scrollParent.addEventListener( 'scroll', this.scrollHandler );
    },
    destroyed() {
      if ( !this.isComplete ) {
        this.scrollParent.removeEventListener('scroll', this.scrollHandler);
      }
    },
  }


  function redirectToSlug( data, slug ) {
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

  function strip_social_desription( str, desriptionLength ) {
    if ((str===null) || (str===''))
      return false;
    else
      str = str.toString();
    return str.replace(/<[^>]*>/g, '').substring(0, desriptionLength) + "...";
  }

  function getTitle( params ) {
    if( params.meta_title ) {
      return params.meta_title
    }
    return params.title
  }

  function upSymbol( value ) {
    if( value ) {
      return value.toUpperCase()
    } else {
      return null
    }
  }

  function apiNewsPrepare( filters ) {
    let filterQuery =
      (filters.type ? '&filters[news-translated][type]=' + filters.type : '') +
      (filters.symbol ? '&filters[portfolio-coins][symbol]=' + upSymbol(filters.symbol) : '')

    return api_news + filterQuery
  }
</script>