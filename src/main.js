import './assets/output.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/axios.js'


createApp(App).use(router).mount('#app')
