import './assets/tailwind.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

import { setupECharts } from "./composables/echarts"; // Import ECharts setup
import VChart from "vue-echarts"; // Import Vue ECharts component

setupECharts(); // Register the components
app.component("v-chart", VChart); // Register v-chart globally

app.use(createPinia())
app.use(router)


import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";

app.use(PrimeVue, {
    unstyled: false,
    theme: {
       preset: Aura,
       options: {
          darkModeSelector: ".tw-dark",
       },
    },
 });

app.mount('#app')
