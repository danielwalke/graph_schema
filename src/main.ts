import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import VNetworkGraph from "v-network-graph"
import "v-network-graph/lib/style.css"


createApp(App).use(VNetworkGraph).mount('#app')
