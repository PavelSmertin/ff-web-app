export default function ({ $axios, error }) {
  // $axios.onRequest(config => {
  //   console.log('Making request to ' + config.url)
  // })

  $axios.onError(e => {
    const code = parseInt(e.response && e.response.status)
    if (code === 404) {
    	error({ statusCode: 404 })
    }
    if (code === 504) {
    	error({ statusCode: 504 })
    }
  })
}