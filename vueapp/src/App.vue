<template>
  <v-app>
    <v-main>
      <Nav />
       <Cities @city-selected="updateSelectedCity" />
      <ReservationStepper
        :selected-city-filter="currentSelectedCityObject?.value"
        :selected-city-display-name="currentSelectedCityObject?.name"
      />
      <AppFooter />
    </v-main>
  </v-app>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';

const currentSelectedCityObject = ref(null);

const updateSelectedCity = (cityObject) => {
  currentSelectedCityObject.value = cityObject;
};

watch(currentSelectedCityObject, (newVal) => {

}, { deep: true }); 


onMounted(() => {
  console.log('--- APP.VUE MOUNTED ---');
  console.log('RAW VITE_WP_USERNAME FROM ENV (App.vue):', import.meta.env.VITE_WP_USERNAME);
  console.log('RAW VITE_WP_APP_PASSWORD FROM ENV (App.vue):', import.meta.env.VITE_WP_APP_PASSWORD);
  console.log('ALL ENV VARS (App.vue):', import.meta.env);
  console.log('--- END APP.VUE MOUNTED ---');
});
</script>