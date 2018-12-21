export const indacoinMixin = {
  methods: {

    coinBuyUrl: function(symbol) {
      return '/buy-coin?from=USD&to=' + symbol
    },

    isActiveCoin: function(symbol) {
      let storeObj = this.$store.state.indacoin
      if (storeObj.coins[symbol] !== undefined && storeObj.coins[symbol].isActive === true) {
        return true;
      }
      return false;
    }

  }
}