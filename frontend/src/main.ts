import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar, Notify } from 'quasar'
import quasarLang from 'quasar/lang/pt-BR'



import router from './modules/router'

import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/dist/quasar.css'

import './css/config.css'

import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()


app.use(pinia)



app.use(Quasar, {
    plugins: {
      Notify
    }, // import Quasar plugins and add here
    lang: quasarLang,
    
  config: {
    brand: {
      // primary: '#e46262',
      // ... or all other brand colors
    },
    notify: {}, // default set of options for Notify Quasar plugin
    /*loading: {...}, // default set of options for Loading Quasar plugin
    loadingBar: { ... }, // settings for LoadingBar Quasar plugin
    // ..and many more (check Installation card on each Quasar component/directive/plugin)
    */
  }
  
})
app.use(router)
app.mount('#app')
