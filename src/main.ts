import './styles/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import * as Icons from '@ant-design/icons-vue'
import App from './App.vue'
import router from './router'
import 'ant-design-vue/dist/antd.css'
import 'animate.css'

const app = createApp(App)

for (const [key, component] of Object.entries(Icons)) {
  app.component(key, component)
}

app.use(createPinia())
app.use(router)
app.use(Antd)

app.mount('#app')
