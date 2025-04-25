/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */


// Plugins
import { registerPlugins } from '@/plugins'

// Composables
import { createApp } from 'vue'

// Components
import App from './App.vue'

// V-calendar
import VCalendar from 'v-calendar';
import 'v-calendar/style.css';

const app = createApp(App)

registerPlugins(app)

app.use(VCalendar, {})

app.mount('#app')