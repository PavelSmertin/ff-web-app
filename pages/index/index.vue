<template>
  <div class="ff-coin">
    <a href="" class="pane-close-mobile pane-close">
      <span class="icon icon-times"></span>
    </a> 

    <div>
<!--       <coin-line v-if="showLine" :data="lineData" :options="options"></coin-line>
 -->
      <p class="social">
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
    transition: 'page',
    head: {
      title: 'ff - новостной портал, предоставляющий самую актуальную информацию, влияющую на стоимость криптовалют'
    },
    data() {
      return {
        enabled: true,
        showLine: false
      }
    },
    mounted () {
      this.showLine = true // showLine will only be set to true on the client. This keeps the DOM-tree in sync.
    },  
    asyncData () {
      const lineData = {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
      }
      const options = {scales: {yAxes: [{ticks: {beginAtZero:true}}]}}
      return { lineData, options }
    }
  }

</script>