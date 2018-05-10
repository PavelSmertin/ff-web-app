import Vue from 'vue'
import VueWebsocket from "vue-websocket";

Vue.use(VueWebsocket, "wss://streamer.cryptocompare.com", {
	reconnection: true
});