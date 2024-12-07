import {createApp} from 'vue'
import {createPinia} from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './style.css'
import App from './App.vue'
import router from "@/routers";
import loadMore from "@/directives/LoadMore.ts";

const app = createApp(App)
const pinia = createPinia()
app
    .directive('load_more', loadMore)
    .use(pinia)
    .use(router)
    .use(ElementPlus)
    .mount('#app')
