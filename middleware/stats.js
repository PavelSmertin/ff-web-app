export default async function ({ app, store, redirect }) {
  if( store.state.indacoin.updatedAt ) {
    return
  }

  let indacoinCoins = null

  try {
    indacoinCoins = await app.$axios.get(`/api/coin/indacoin-coins?per-page=500`)
  } catch (e) {
    indacoinCoins = null
    console.error('indacoin error')
  }

  if( indacoinCoins == null) {
    return
  }

  // const arrayToObject = (array, keyField) =>
  //  array.reduce((obj, item) => {
  //    obj[item[keyField]] = item
  //    return obj
  //  }, {})


  //const ordered = arrayToObject(indacoinCoins.data.data, "id")

  // Object.keys(indacoinCoins.data.data).sort().forEach(function(key, element) {


  //   ordered[element.id] = element;
  // });

  store.commit('SET_INDACOIN_COINS', indacoinCoins.data.data)

}

