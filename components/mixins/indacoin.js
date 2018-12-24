export const indacoinMixin = {
  methods: {
    coinBuyUrl: function(symbol) {
      return '/buy-coin?from=USD&to=' + symbol
    },
    isActiveCoin: function(symbol) {
      let storeObj = this.$store.state.indacoin
      return  storeObj 
              && storeObj.coins 
              && storeObj.coins.find( el => el.attributes.symbol == symbol)
    }
  }
}