<template>
  <div class="flash_form">

    <img class="love_img" src="~/assets/images/love.svg" alt="thnx">

    <h1>Спасибо</h1>

    <p class="success_text">
      {{ message }}
    </p>

    <p class="ff-label instruction">
      Мы очень трепетно относимся к нашим пользователям, и поэтому вся ваша контактная информация строго конфиденциальна.
    </p>
    
  </div>
</template>


<script>

  export default {
    data() {
      return {
        message: "На вашу электронную почту придет письмо со ссылкой. Пройдите по ссылке, чтобы установить новый пароль."
      }
    }
  }

</script>