<template>
    <div class="сhart_сontainer" :id="containerId" />
</template>

<script>

  import Datafeed from '~/components/chart_api/Datafeed'

  //TradingView JS API Integration Tutorial: Introduction
  // https://medium.com/@jonchurch/tradingview-js-api-integration-tutorial-introduction-5e4809d9ef36

  //  этот озалуп не заработал
  //import { widget } from '~/assets/js/charting_library.min'

  let { TradingView } = require('~/assets/js/charting_library.min')

  export default {

    name: 'chart-trading-view',

    props: {
      symbol: {
        default: 'BTC/USDT',
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
        overrides: {
          "mainSeriesProperties.showCountdown": true,
          //"paneProperties.background": "#131722",
          //"paneProperties.vertGridProperties.color": "#363c4e",
          //"paneProperties.horzGridProperties.color": "#363c4e",
          "symbolWatermarkProperties.transparency": 90,
          "scalesProperties.textColor" : "#AAA",

          "mainSeriesProperties.candleStyle.upColor": "#8FCC14",
          "mainSeriesProperties.candleStyle.downColor": "#FF6666",
          "mainSeriesProperties.candleStyle.drawWick": true,
          "mainSeriesProperties.candleStyle.drawBorder": true,
          "mainSeriesProperties.candleStyle.borderColor": "#378658",
          "mainSeriesProperties.candleStyle.borderUpColor": "#8FCC14",
          "mainSeriesProperties.candleStyle.borderDownColor": "#FF6666",
          "mainSeriesProperties.candleStyle.wickUpColor": '#8FCC14',
          "mainSeriesProperties.candleStyle.wickDownColor": '#FF6666',
          "mainSeriesProperties.candleStyle.barColorsOnPrevClose": false,
        }
      }

      const tvWidget = new TradingView.widget(widgetOptions)
    }
  }

</script>

<style lang="scss" scoped>
.сhart_сontainer {
  width: 100%;
  height: calc(100vh/2);
}
</style>