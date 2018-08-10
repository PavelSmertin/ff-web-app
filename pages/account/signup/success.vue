<template>
  <div class="flash_form">

    <img class="love_img" src="~/assets/images/love.svg" alt="thnx">

    <h1>Спасибо</h1>

    <p class="success_text">
      {{ message }}
    </p>

    <div class="row_field row_tools row_center">
      <nuxt-link :to="{name: 'index'}" class="button_link">Назад на главную</nuxt-link>
    </div>

    <div class="row_field row_tools row_center">
      <button v-on:click="resend" class="row_link">Выслать код повторно</button>
    </div>

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
    data() {
      return {
        message: "На вашу электронную почту придет письмо с подтверждением вашего аккаунта. Пройдите по ссылке, чтобы закончить регистрацию."
      }
    },
    methods: {
      async resend() {
        this.error = null

        // this.$auth.setToken('api', 'djsnjn')
        // this.$auth.setUser({})

        var username = this.$auth.$storage.getUniversal('username')

        if( !username ) {
          this.$router.push({ name: `account-signup` })
          return
        }

        return this.$axios.post( `/api/auth/resend-confirmation-email`, 'ResendConfirmationCode[email]=' + username )
          .then(response => {
            if( response.data.success ) {
              this.showMessage("Вам отправлено повторное письмо c кодом активации")
            } else {
              this.showMessage("Письмо не отправлено")
            }
          })
          .catch(function (error) {
            this.showMessage("Письмо не отправлено")
          });
      },

      showMessage(message) {
        this.message = message
      }
    }
  }

</script>