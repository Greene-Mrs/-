
import { createApp } from 'vue'

import { createPinia } from "pinia";
import DataVVue3 from '@kjgl77/datav-vue3'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import "./assets/main.scss";
import router from "./router";

import App from './App.vue'



const app = createApp(App)
app.use(createPinia());
app.use(DataVVue3)
app.use(router)
app.use(ElementPlus)

app.mount('#app')
