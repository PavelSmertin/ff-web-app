<template>
  <form method="POST" name="SignupForm">
    <fieldset>
      <div class="form_logo"></div>
      <div class="row_field">
        <label class="ff-label">Email</label>
        <input type="text" name="email" placeholder="Ваш e-mail">
      </div>
      <div class="row_field">
        <label class="ff-label">Пароль</label>
        <input type="password" idname="password">
      </div>
      <div class="row_field">
        <label class="ff-label">Повторите пароль</label>
        <input type="password" idname="password">
      </div>

      <div class="row_field row_tools row_center">
        <input type="submit" value="Регистрация">
      </div>

      <p class="ff-label instruction">
        Если вы уже зарегистрированы в системе ФФ, то используя свой логин и пароль пройдите <nuxt-link :to="{name: 'account-signin'}">авторизацию</nuxt-link>.
      </p>
    </fieldset>
  </form>
</template>