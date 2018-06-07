<template>
  <div class="flash_form">

    <img class="love_img" src="~/assets/images/love.svg" alt="thnx">

    <h1>Поздравляем!</h1>

    <p class="success_text">
      {{ message }}
    </p>

    <div class="row_field row_tools row_center">
      <nuxt-link :to="{name: 'account-signin'}" class="button_link">Войти</nuxt-link>
    </div>

    <p class="ff-label instruction">
      Мы очень трепетно относимся к нашим пользователям, и поэтому вся ваша контактная информация строго конфиденциальна.
    </p>
    
  </div>
</template>


<script>

  export default {
    data() {
      return {
        message: "Ваш пароль успешно изменен!"
      }
    }
  }

</script>