<template>
  <div class="flash_form">
    <h1>Подтверждение email</h1>

    <p class="success_text row_center">
      {{ message }}
    </p>

    <p class="ff_label instruction">
      Мы очень трепетно относимся к нашим пользователям, и поэтому вся ваша контактная информация строго конфиденциальна.
    </p>
  </div>
</template>


<script>

  export default {
    head() {
      return { meta: [{ hid: 'robots', name: 'robots', content: 'noindex' }]}
    },

    async asyncData({ app, params, redirect }) {

      const { data } = await app.$axios.get( `/api/auth/email-confirm`, { params: { code: params.code } } )
      if(data.email_confirmed) {

        app.$auth.setToken('api', 'Bearer ' + data.access_token)
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
      this.$router.push({ path: `/` })    
    },

  }

</script>