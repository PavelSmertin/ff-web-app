<template>
  <form @keydown.enter.stop.prevent="request" name="PasswordResetRequestForm">
    <fieldset>
      <div class="form_logo"></div>
      <ul v-if="errors" class="row_errors">
        <li v-for="error of errors" v-bind:key="error">
          {{error}}
        </li>
      </ul>
      <div class="row_field">
        <label class="ff-label">Email</label>
        <input type="email" name="email" v-model="email" placeholder="Ваш e-mail">
      </div>

      <div class="row_field row_tools row_center">
        <button v-if="!busy" class="button_link" @click.stop.prevent="request">Восстановить</button>
        <div v-else class="loading-spiral"></div>
      </div>

      <p class="ff-label instruction">
        Если вы еще не зарегистрированы в системе FF.ru, то воспользуйтесь <nuxt-link :to="{name: 'account-signup'}">регистрацией</nuxt-link>.
      </p>
    </fieldset>
  </form>
</template>


<script>

  export default {
    head() {
      return { meta: [{ hid: 'robots', name: 'robots', content: 'noindex' }]}
    },
    data() {
      return {
        email: null,
        errors: null,
        busy: false,
      }
    },
    methods: {
      async request() {

        this.busy = true
        this.errors = null

        return this.$axios.post(`/api/auth/request-password-reset`, 'PasswordResetRequestForm[email]=' + this.email)
          .then((response) => {
            console.log("success")
            this.$router.push({ name: `account-forgot-follow` })
          })
          .catch(e => {
            console.log(e)

            this.busy = false
            this.errors = e.response.data.errors.map((el) => { return el.title})
            var element = this.$parent.$refs["scroll_container_account"];
            element.scrollTo(0, 0);
          })
      }
    }
  }

</script>