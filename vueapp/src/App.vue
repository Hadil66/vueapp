<template>
  <v-app>
    <v-main>
      <Nav />
      <Dashboard />
      <ReservationStepper />
      <AppFooter />
    </v-main>
  </v-app>
</template>

<script setup>
import { onMounted } from 'vue'; 

import Nav from './components/Nav.vue';
import Dashboard from './components/Dashboard.vue';
import ReservationStepper from './components/ReservationStepper.vue';
import AppFooter from './components/AppFooter.vue';

onMounted(() => {
  console.log('--- APP.VUE MOUNTED ---');
  console.log('RAW VITE_WP_USERNAME FROM ENV (App.vue):', import.meta.env.VITE_WP_USERNAME);
  console.log('RAW VITE_WP_APP_PASSWORD FROM ENV (App.vue):', import.meta.env.VITE_WP_APP_PASSWORD); 
  console.log('ALL ENV VARS (App.vue):', import.meta.env);
  console.log('--- END APP.VUE MOUNTED ---');
});
</script>