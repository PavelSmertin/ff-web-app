<template>
  <div class="flash_form">
    <h1>Спасибо</h1>

    <p class="success_text">
      На вашу электронную почту придет письмо с подтверждением вашего аккаунта. Пройдите по ссылке, чтобы закончить регистрацию.
    </p>

    <div class="row_field row_tools row_center">
      <nuxt-link :to="{name: 'index'}" class="button_link">Назад на главную</nuxt-link>
    </div>

    <p class="ff-label instruction">
      Мы очень трепетно относимся к нашим пользователям, и поэтому вся ваша контактная информация строго конфиденциальна.
    </p>
  </div>
</template>