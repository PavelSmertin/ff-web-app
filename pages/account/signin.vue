<template>
  <form method="POST" name="LoginForm">
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
      <div class="row_field row_tools">
        <input type="submit" value="Войти">
        <a href="#">Забыл пароль</a>
      </div>

      <p class="ff-label instruction">
        Если вы еще не зарегистрированы в системе ФФ, то воспользуйтесь <nuxt-link :to="{name: 'account-signup'}">регистрацией</nuxt-link>.
      </p>
    </fieldset>
  </form>
</template>