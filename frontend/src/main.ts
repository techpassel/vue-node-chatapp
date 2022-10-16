import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.scss'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCheckCircle, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import navigationGuard from './router/navigationGuard'

/* add icons to the library */
library.add(faRightFromBracket)
library.add(faCheckCircle)

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)

app.use(createPinia())
app.use(router)
navigationGuard();

app.mount('#app')
