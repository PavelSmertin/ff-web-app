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
    downSymbol(value) {
      return value.toLowerCase()
    },
    coinPath(coin) {
      if (coin.attributes.symbol == 'BTC') {
        return {name: 'index'}
      }
      return {path: `/${this.downSymbol(coin.attributes.symbol)}`}
    },
  }
}