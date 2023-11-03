import './assets/base.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'

import Vcharts from "vue-echarts"

import { VueQueryPlugin } from "@tanstack/vue-query"
import App from './App.vue'
import router from './router'



const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueQueryPlugin)
app.component('v-charts', Vcharts)

app.mount('#app')
