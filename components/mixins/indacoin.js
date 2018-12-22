export const indacoinMixin = {
  methods: {

    coinBuyUrl: function(symbol) {
      return '/buy-coin?from=USD&to=' + symbol
    },

    isActiveCoin: function(symbol) {
      let coin = this.getCoinBySymbol(symbol)
      return coin !== null;
    },

    getCoinBySymbol: function(symbol) {
      let storeObj = this.$store.state.indacoin
      let coin = null;
      if( storeObj && storeObj.coins ) {
        coin = storeObj.coins.find( el => el.attributes.symbol == symbol)
      }
      return coin;
    }

  }
}