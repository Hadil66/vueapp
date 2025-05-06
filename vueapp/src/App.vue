<template>
  <v-app>
    <v-main>
      <router-view />
      <!-- It's unusual to have Nav, Dashboard, Cards directly here if router-view is also present.
           Typically, these would be part of a layout or specific routed views.
           But for the debug, this is fine. -->
      <Nav />
      <Dashboard />
      <Cards />
      <AppFooter />
    </v-main>
  </v-app>
</template>

<script setup>
import { onMounted } from 'vue'; // Import onMounted

// Assuming Nav, Dashboard, Cards, AppFooter are imported components if not global
// import Nav from './components/Nav.vue';
// import Dashboard from './components/Dashboard.vue';
// import Cards from './components/Cards.vue'; // Or wherever Cards.vue is
// import AppFooter from './components/AppFooter.vue';


onMounted(() => {
  console.log('--- APP.VUE MOUNTED ---');
  console.log('RAW VITE_WP_USERNAME FROM ENV (App.vue):', import.meta.env.VITE_WP_USERNAME);
  console.log('RAW VITE_WP_APP_PASSWORD FROM ENV (App.vue):', import.meta.env.VITE_WP_APP_PASSWORD); // Also check this one
  console.log('ALL ENV VARS (App.vue):', import.meta.env);
  console.log('--- END APP.VUE MOUNTED ---');
});
</script>