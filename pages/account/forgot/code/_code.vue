<template>


  <form @keydown.enter.stop.prevent="reset" name="ResetPasswordForm">
    <fieldset>
      <div class="form_logo"></div>

      <h1>Смена пароля</h1>

      <ul v-if="errors" class="row_errors">
        <li v-for="error of errors" v-bind:key="error">
          {{error}}
        </li>
      </ul>

      <div class="row_field">
        <label class="ff-label">Новый пароль</label>
        <input type="password" v-model="password" name="password">
      </div>
      <div class="row_field">
        <label class="ff-label">Повторите пароль</label>
        <input type="password" v-model="repassword" name="repassword">
      </div>

        <div class="row_field row_tools row_center">
          <button v-if="!busy" class="button_link" @click.stop.prevent="reset">Сменить пароль</button>
          <div v-else class="loading-spiral"></div>
        </div>

      <p class="ff-label instruction">
        Мы очень трепетно относимся к нашим пользователям, и поэтому вся ваша контактная информация строго конфиденциальна.
      </p>

    </fieldset>
  </form>
</template>


<script>

  export default {

    data() {
      return {
        code: null,
        password: null,
        repassword: null,
        errors: null,
        busy: false,
      }
    },

    async asyncData({ params }) {
      return { code: params.code } 
    },

    methods: {
      async reset() {
        this.busy = true
        this.errors = null

        return this.$axios.post(`/api/auth/reset-password?code=` + this.code, '&ResetPasswordForm[password]=' 
                  + this.password + '&ResetPasswordForm[rePassword]=' 
                  + this.repassword
          )
          .then((response) => {
            this.$router.push({ name: `account-forgot-success` })
          })
          .catch(e => {
            this.busy = false
            this.errors = e.response.data.errors.map((el) => { return el.title})
            var element = this.$parent.$refs["scroll_container_account"];
            element.scrollTo(0, 0);
          })
      },
    }

  }

</script>