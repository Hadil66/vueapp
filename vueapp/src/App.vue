<template>
  <v-app>
    <v-main>
      <Nav />
      <Cities @city-selected="updateSelectedCity" />
      <ReservationStepper />
      <AppFooter />
    </v-main>
  </v-app>
</template>

<script setup>
import { onMounted, ref } from 'vue'; 

import Nav from './components/Nav.vue';
import Cities from './components/Cities.vue';
import ReservationStepper from './components/ReservationStepper.vue';
import AppFooter from './components/AppFooter.vue';

const currentSelectedCity = ref(null);

const updateSelectedCity = (cityValue) => {
  currentSelectedCity.value = cityValue;
};
onMounted(() => {
  console.log('--- APP.VUE MOUNTED ---');
  console.log('RAW VITE_WP_USERNAME FROM ENV (App.vue):', import.meta.env.VITE_WP_USERNAME);
  console.log('RAW VITE_WP_APP_PASSWORD FROM ENV (App.vue):', import.meta.env.VITE_WP_APP_PASSWORD); 
  console.log('ALL ENV VARS (App.vue):', import.meta.env);
  console.log('--- END APP.VUE MOUNTED ---');
});
</script>