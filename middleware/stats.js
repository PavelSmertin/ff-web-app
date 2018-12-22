export default async function ({ app, store, redirect }) {
  if( store.state.indacoin.updatedAt ) {
    return
  }

  let indacoinCoins = null


  try {
    indacoinCoins = await app.$axios.get(`https://indacoin.com/api/mobgetcurrenciesinfoi`)
  } catch (e) {
    indacoinCoins = null
    console.error('индакоин ерор')
  }

  if( indacoinCoins == null) {
    return
  }

  const ordered = {};

  Object.keys(indacoinCoins.data.result).sort().forEach(function(key) {
    ordered[key] = indacoinCoins.data.result[key];
  });

  store.commit('SET_INDACOIN_COINS', ordered)

}