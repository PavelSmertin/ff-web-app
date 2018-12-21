export default async function ({ app, store, redirect }) {
  if( store.state.indacoin.updatedAt ) {
    return
  }

  let indacoinCoins

  try {
    indacoinCoins = await app.$axios.get(`https://indacoin.com/api/mobgetcurrenciesinfoi`)
    const ordered = {};

    Object.keys(indacoinCoins.data.result).sort().forEach(function(key) {
      ordered[key] = indacoinCoins.data.result[key];
    });

    store.commit('SET_INDACOIN_COINS', ordered)

  } catch (e) {
    console.error(e)
  }
}