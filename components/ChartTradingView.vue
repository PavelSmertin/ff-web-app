<template>
    <div class="TVChartContainer" >
        test
    </div>
</template>

<script>

      console.log('import TVChartContainer')

  //import { widget } from '~/assets/js/charting_library.min';


  export default {

    name: 'chart-trading-view',

    props: {
      symbol: {
        default: 'AAPL',
        type: String,
      },
      interval: {
        default: 'D',
        type: String,
      },
      containerId: {
        default: 'tv_chart_container',
        type: String,
      },
      datafeedUrl: {
        default: 'https://demo_feed.tradingview.com',
        type: String,
      },
      libraryPath: {
        default: '/charting_library/',
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
      console.log('mounted TVChartContainer')

    //   const widgetOptions = {
    //     symbol: this.symbol,
    //     // BEWARE: no trailing slash is expected in feed URL
    //     datafeed: new window.Datafeeds.UDFCompatibleDatafeed(this.datafeedUrl),
    //     interval: this.interval,
    //     container_id: this.containerId,
    //     library_path: this.libraryPath,
    //     locale: getLanguageFromURL() || 'en',
    //     disabled_features: ['use_localstorage_for_settings'],
    //     enabled_features: ['study_templates'],
    //     charts_storage_url: this.chartsStorageUrl,
    //     charts_storage_api_version: this.chartsStorageApiVersion,
    //     client_id: this.clientId,
    //     user_id: this.userId,
    //     fullscreen: this.fullscreen,
    //     autosize: this.autosize,
    //     studies_overrides: this.studiesOverrides,
    //   };
    //   const tvWidget = new TradingView.widget(widgetOptions);
    //   tvWidget.onChartReady(() => {
    //     const button = tvWidget.createButton()
    //       .attr('title', 'Click to show a notification popup')
    //       .addClass('apply-common-tooltip')
    //       .on('click', () => tvWidget.showNoticeDialog({
    //         title: 'Notification',
    //         body: 'TradingView Charting Library API works correctly',
    //         callback: () => {
    //           // eslint-disable-next-line no-console
    //           console.log('Noticed!');
    //         },
    //       }));
    //     button[0].innerHTML = 'Check API';
    //   });
    }


  }
</script>

<style lang="scss" scoped>
.TVChartContainer {
  height: calc(100vh - 80px);
}
</style>