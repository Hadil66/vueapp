/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */


// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

const app = createApp(App)

registerPlugins(app)


// V-calendar
import VCalendar from 'v-calendar';
import 'v-calendar/style.css';

app.use(VCalendar, {})

app.mount('#app')