export default async function ({ app, store, redirect }) {
  if( store.state.indacoin.updatedAt ) {
    return
  }

  let indacoinCoins = null

  try {
    indacoinCoins = await app.$axios.get(`/api/coin/indacoin-coins?per-page=500`)
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