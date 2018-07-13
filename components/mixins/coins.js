export const coinsMixin = {
    methods: {
        formatPrice( value ) {
            let val = (value/1).toFixed(2).replace('.', ',')
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
        },
        downSymbol( value ) {
            return value.toLowerCase()
        },
        coinPath( coin ) {
            if( coin.attributes.symbol == 'BTC') {
                return { name: 'index' }
            }
            return { name: 'index-symbol',  params: { symbol: this.downSymbol(coin.attributes.symbol) }}
        },
    }
}