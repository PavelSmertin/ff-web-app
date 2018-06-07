<template>
  <form @keydown.enter.stop.prevent="register" name="SignupForm">
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
      <div class="row_field">
        <label class="ff-label">Пароль</label>
        <input type="password" v-model="password" name="password">
      </div>
      <div class="row_field">
        <label class="ff-label">Повторите пароль</label>
        <input type="password" v-model="repassword" name="repassword">
      </div>

      <div class="row_field row_tools row_center">
        <button v-if="!busy" class="button_link" @click.stop.prevent="register">Регистрация</button>
        <div v-else class="loading-spiral"></div>
      </div>

      <p class="ff-label instruction">
        Если вы уже зарегистрированы в системе FF.ru, то используя свой логин и пароль пройдите <nuxt-link :to="{name: 'account-signin'}">авторизацию</nuxt-link>.
      </p>
    </fieldset>
  </form>
</template>


<script>

  export default {
    data() {
      return {
        email: null,
        password: null,
        repassword: null,
        errors: null,
        busy: false,
      }
    },
    methods: {
      async register() {

        this.busy = true
        this.errors = null


        if(this.email) {
          this.$auth.$storage.setUniversal('username',  this.email )
        }


        // this.$axios.setHeader('Content-Type', 'application/x-www-form-urlencoded', ['post'])

      // this.$axios.onRequest((config) => {
      //   console.log(config)
      //   // config.headers.common['Content-Type'] = 'application/x-www-form-urlencoded'
      // })
      // this.$axios.setHeader('Access-Control-Allow-Origin', false)
      // this.$axios.setHeader('Access-Control-Request-Method', false)
      // headers: { 'content-type': 'application/x-www-form-urlencoded' }

        // const instance = axios.create({
        //   baseURL: 'https://api.ff.ru/v1/',
        //   headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Access-Control-Allow-Origin': '*'}
        // });
        return this.$axios.post(`/api/auth/signup`, 'SignupForm[email]=' 
                  + this.email + '&SignupForm[password]=' 
                  + this.password + '&SignupForm[rePassword]=' 
                  + this.repassword
          )
          .then((response) => {
            this.$router.push({ name: `account-signup-success` })
          })
          .catch(e => {
            this.busy = false
            this.errors = e.response.data.errors.map((el) => { return el.title})
            var element = this.$parent.$refs["scroll_container_account"];
            element.scrollTo(0, 0);
          })
      }
    }
  }

</script>