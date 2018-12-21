export const coinsMixin = {
  methods: {
    formatPrice(value) {
      if( value >= 0.5 && value < 100) {
        return (value/1).toFixed(2)
      }
      if( value >= 0.1 && value < 0.5) {
        return (value/1).toFixed(3)
      }
      if( value >= 0.01 && value < 0.1) {
        return (value/1).toFixed(5)
      }
      if( value < 0.01) {
        return (value/1).toFixed(8)
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