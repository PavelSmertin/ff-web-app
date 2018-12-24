export default async function ({ app, store, redirect }) {
  
  if( store.state.indacoin.updatedAt ) {
    return
  }

  try {
    let indacoinCoins = await app.$axios.get(`/api/coin/indacoin-coins?per-page=500`)
    store.commit('SET_INDACOIN_COINS', indacoinCoins.data.data)
  } catch (e) {
    console.error('indacoin error')
  }

}

