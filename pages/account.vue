<template>
  <div class="ff_account scroll-container" ref="scroll_container_account">
    <div>

      <div class="form_pane">

        <ul class="navigation">
          <li>
            <nuxt-link :to="{name: 'account-signin'}">Вход</nuxt-link>
          </li>
          <li>
            <nuxt-link :to="{name: 'account-signup'}">Регистрация</nuxt-link>
          </li>
        </ul>

        <nuxt-child />

      </div>

    </div>
  </div>
</template>