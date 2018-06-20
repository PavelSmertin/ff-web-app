<template>
  <div class="flash_form">
    <h1>Подтверждение email</h1>

    <p class="success_text row_center">
      {{ message }}
    </p>

    <p class="ff-label instruction">
      Мы очень трепетно относимся к нашим пользователям, и поэтому вся ваша контактная информация строго конфиденциальна.
    </p>
  </div>
</template>


<script>

  export default {
    head() {
      return { meta: [{ hid: 'robots', name: 'robots', content: 'noindex' }]}
    },

    // fetch ({ app, store, params }) {

    //   console.log("fetch ")
    //   app.$auth.setToken('api', params.code)
    //   app.$auth.setUser({})


    //   // return axios.get('http://my-api/stars')
    //   // .then((res) => {
    //   //   store.commit('setStars', res.data)
    //   // })
    // },

    async asyncData({ app, params, redirect }) {

      // console.log("asyncData ")

      // app.$auth.setToken('api', 'djsnjn')
      // app.$auth.setUser({})

      // console.log(app.$auth.loggedIn)
      // console.log(app.$auth.getToken('api'))

      const { data } = await app.$axios.get( `/api/auth/email-confirm`, { params: { code: params.code } } )
      if(data.email_confirmed) {

        app.$auth.setToken('api', data.access_token)
        app.$auth.setUser({})

        return {
          message: "Вы будете перенаправлены на главную"
        }
      } 
      return {
        message: "Код подтверждения не подходит"
      }
    },

    mounted () {
      this.$router.push({ name: `index` })    
    },

  }

</script>