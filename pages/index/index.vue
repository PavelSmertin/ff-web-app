<template>
  <div class="pane-inner text-pane text-home" activefilters="[object Object]">
    <a href="" class="pane-close-mobile pane-close">
      <span class="icon icon-times"></span>
    </a> 
    <div class="donate-sm">
      <p><strong>ff.ru</strong> - новостной портал, предоставляющий самую актуальную информацию, влияющую на стоимость криптовалют
      </p> 
      <hr class="pane-hr"> 
      <h3>Сообщество</h3> 
      <p>
        <a href="https://vk.com/cryptoff" class="colored-link" target="_blank">ВК</a>
        <br />
        <a href="https://t.me/ff_ru" class="colored-link" target="_blank">Телеграм</a>
        <br />
        <a href="https://twitter.com/FFru11" class="colored-link" target="_blank">Твиттер</a>
        <br />
        <a href="https://fb.com/crypto.ff.ru/" class="colored-link" target="_blank">Facebook</a>
      </p>
    </div>
  </div>
</template>



<script>
  import Vue from 'vue'

  let ToggleButton
  if (process.browser) {
    ToggleButton = require('vue-js-toggle-button')
  }

  export default {
    head: {
      title: 'ff - новостной портал, предоставляющий самую актуальную информацию, влияющую на стоимость криптовалют'
    },
    data() {
      return {
        enabled: true
      }
    }
  }

</script>