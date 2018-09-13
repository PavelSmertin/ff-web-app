<template>
    <div class="TVChartContainer" :id="containerId" />
</template>

<script>

  import Datafeed from '~/components/chart_api/Datafeed'


  //  этот озалуп не заработал
  //import { widget } from '~/assets/js/charting_library.min'

  //let { Datafeeds } = require('~/assets/js/datafeeds/udf/dist/bundle.js')
  let { TradingView } = require('~/assets/js/charting_library.min')

  export default {

    name: 'chart-trading-view',

    // props: {
    //   symbol: {
    //     default: 'AAPL',
    //     type: String,
    //   },
    //   interval: {
    //     default: 'D',
    //     type: String,
    //   },
    //   containerId: {
    //     default: 'tv_chart_container',
    //     type: String,
    //   },
    //   datafeedUrl: {
    //     default: 'https://demo_feed.tradingview.com',
    //     type: String,
    //   },
    //   libraryPath: {
    //     default: '',
    //     type: String,
    //   },
    //   chartsStorageUrl: {
    //     default: 'https://saveload.tradingview.com',
    //     type: String,
    //   },
    //   chartsStorageApiVersion: {
    //     default: '1.1',
    //     type: String,
    //   },
    //   clientId: {
    //     default: 'tradingview.com',
    //     type: String,
    //   },
    //   userId: {
    //     default: 'public_user_id',
    //     type: String,
    //   },
    //   fullscreen: {
    //     default: false,
    //     type: Boolean,
    //   },
    //   autosize: {
    //     default: true,
    //     type: Boolean,
    //   },
    //   studiesOverrides: {
    //     type: Object,
    //   }
    // },

    props: {
      symbol: {
        default: 'CCCAGG:BTC/USD',
        type: String,
      },
      interval: {
        default: '15',
        type: String,
      },
      containerId: {
        default: 'tv_chart_container',
        type: String,
      },
      libraryPath: {
        default: '',
        type: String,
      },
      chartsStorageUrl: {
        default: 'https://saveload.tradingview.com',
        type: String,
      },
      chartsStorageApiVersion: {
        default: '1.1',
        type: String,
      },
      clientId: {
        default: 'tradingview.com',
        type: String,
      },
      userId: {
        default: 'public_user_id',
        type: String,
      },
      fullscreen: {
        default: false,
        type: Boolean,
      },
      autosize: {
        default: true,
        type: Boolean,
      },
      studiesOverrides: {
        type: Object,
      }
    },

    mounted() {

      // const widgetOptions = {
      //   symbol: this.symbol,
      //   // BEWARE: no trailing slash is expected in feed URL
      //   datafeed: new Datafeeds.UDFCompatibleDatafeed( this.datafeedUrl ),
      //   datafeed: Datafeed,
      //   interval: this.interval,
      //   container_id: this.containerId,
      //   library_path: this.libraryPath,
      //   locale: 'ru',
      //   disabled_features: ['use_localstorage_for_settings'],
      //   enabled_features: ['study_templates'],
      //   charts_storage_url: this.chartsStorageUrl,
      //   charts_storage_api_version: this.chartsStorageApiVersion,
      //   client_id: this.clientId,
      //   user_id: this.userId,
      //   fullscreen: this.fullscreen,
      //   autosize: this.autosize,
      //   studies_overrides: this.studiesOverrides,
      // }


      const widgetOptions = {
        debug: false,
        symbol: this.symbol,
        datafeed: Datafeed,
        interval: this.interval,
        container_id: this.containerId,
        library_path: this.libraryPath,
        locale: 'ru',
        disabled_features: ['use_localstorage_for_settings'],
        enabled_features: ['study_templates'],
        charts_storage_url: this.chartsStorageUrl,
        charts_storage_api_version: this.chartsStorageApiVersion,
        client_id: this.clientId,
        user_id: this.userId,
        fullscreen: this.fullscreen,
        autosize: this.autosize,
        studies_overrides: this.studiesOverrides,
        // overrides: {
        //   // "mainSeriesProperties.showCountdown": true,
        //   "paneProperties.background": "#131722",
        //   "paneProperties.vertGridProperties.color": "#363c4e",
        //   "paneProperties.horzGridProperties.color": "#363c4e",
        //   "symbolWatermarkProperties.transparency": 90,
        //   "scalesProperties.textColor" : "#AAA",
        //   "mainSeriesProperties.candleStyle.wickUpColor": '#336854',
        //   "mainSeriesProperties.candleStyle.wickDownColor": '#7f323f',
        // }
      }

      const tvWidget = new TradingView.widget(widgetOptions)
    }
  }

</script>

<style lang="scss" scoped>
.TVChartContainer {
  width: 100%;
  height: calc(100vh);
}
</style>