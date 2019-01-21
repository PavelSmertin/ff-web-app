export const coinsMixin = {
  methods: {
    formatPrice(value) {
      let valueABS = Math.abs(value)
      if( valueABS >= 0.5 && valueABS < 100) {
        return (value/1).toFixed(2)
      }
      if( valueABS >= 0.1 && valueABS < 0.5) {
        return +(value/1).toFixed(3)
      }
      if( valueABS >= 0.01 && valueABS < 0.1) {
        return +(value/1).toFixed(5)
      }
      if( valueABS < 0.01) {
        return +(value/1).toFixed(8)
      }
      let val = (value/1).toFixed(0)
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    },

    formatPercent( value ) {
      return (value * 100 / 1).toFixed(2)
    },

    formatDateTime( dateString ) {
      let date  = new Date(dateString)
      let year  = date.getFullYear()
      let day   = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
      let month   = date.getMonth() <= 8 ? `0${date.getMonth()+1}` : date.getMonth()+1
      let hour  = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
      let min   = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
      return `${day}.${month}.${year} ${hour}:${min}`
    },

    downSymbol(value) {
      return value.toLowerCase()
    },
    
    coinPath(coin) {
      if (coin.attributes.symbol == 'BTC') {
        return {name: 'index-index'}
      }
      return {path: `/${this.downSymbol(coin.attributes.symbol)}`}
    },
  }
}