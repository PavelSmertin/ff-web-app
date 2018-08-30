<template>
    <div class="ff_coin_list coin_page_row">
        <nuxt-link
            v-for="coin of otherCoins" 
            :key="coin.id"
            @click.native="onCoinClick( coin.attributes.symbol )"
            :to="coinPath(coin)"
            class="coin_row"
            >
            <div class="coin_details_item i_symbol" >
                {{ coin.attributes.symbol }}
            </div>
            <div class="coin_details_item i_price">
                ${{ formatPrice(coin.attributes.price_usd) }}
            </div>
            <div class="coin_details_item change" v-bind:class="{ negative: coin.attributes.percent_change24h < 0 }">
                {{ coin.attributes.percent_change24h }}%
            </div>
        </nuxt-link>
    </div>
</template>

<script>

    import { coinsMixin } from '~/components/mixins/coins.js'
    import { analMixin } from '~/components/mixins/analitics.js'

    export default {
        name: 'coins-list-top',

        mixins: [ coinsMixin, analMixin ],

        methods: {
            onCoinClick: function ( symbol ) {
              this.sendEvent( 'BTCCoinsOther', 'click', symbol );
            },
        },

        props: {
            otherCoins: ''
        }
    }
</script>