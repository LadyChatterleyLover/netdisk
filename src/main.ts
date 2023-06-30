import './styles/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import * as Icons from '@ant-design/icons-vue'
import VXETable from 'vxe-table'
import vue3videoPlay from 'vue3-video-play'
import VuePlyr from 'vue-plyr'
import App from './App.vue'
import router from './router'
import 'ant-design-vue/dist/antd.css'
import 'animate.css'
import 'vxe-table/lib/style.css'
import 'vue3-video-play/dist/style.css'
import 'vue-plyr/dist/vue-plyr.css'

const app = createApp(App)

for (const [key, component] of Object.entries(Icons)) {
  app.component(key, component)
}

app.component('Vue3videoPlay', vue3videoPlay)

app.use(createPinia())
app.use(router)
app.use(Antd)
app.use(VXETable)
app.use(VuePlyr, {
  plyr: {},
})

app.mount('#app')
