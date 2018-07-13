<template>
    <div class="ff_coin_list row">
        <div class="col-lg-6 flex-row">
            <nuxt-link
                    v-for="index in 4"
                    v-bind:key="otherCoins[index-1].id"
                    :to="coinPath(otherCoins[index-1])"
                    class="currency coin_row col-sm-3"
            >
                <div class="coin_details_item i_symbol" >
                    {{ otherCoins[index-1].attributes.symbol }}
                </div>
                <div class="coin_details_item i_price">
                    ${{ formatPrice(otherCoins[index-1].attributes.price_usd) }}
                </div>
                <div class="coin_details_item change" v-bind:class="{ negative: (otherCoins[index-1].attributes.percent_change24h < 0) }">
                    {{ otherCoins[index-1].attributes.percent_change24h }}%
                </div>
            </nuxt-link>
        </div>
        <div class="col-lg-6 flex-row">
            <nuxt-link
                    v-for="index in 8"
                    v-bind:key="otherCoins[index-1].id"
                    :to="coinPath(otherCoins[index-1])"
                    class="currency coin_row col-sm-3"
                    v-if="index > 4"
            >
                <div class="coin_details_item i_symbol" >
                    {{ otherCoins[index-1].attributes.symbol }}
                </div>
                <div class="coin_details_item i_price">
                    ${{ formatPrice(otherCoins[index-1].attributes.price_usd) }}
                </div>
                <div class="coin_details_item change" v-bind:class="{ negative: (otherCoins[index-1].attributes.percent_change24h < 0) }">
                    {{ otherCoins[index-1].attributes.percent_change24h }}%
                </div>
            </nuxt-link>
        </div>

    </div>

</template>

<script>

    import { coinsMixin } from './mixins/coins.js'

    export default {
        name: 'coins-list-top',

        mixins: [coinsMixin],

        methods: {
        },

        props: {
            otherCoins: []
        }
    }
</script>