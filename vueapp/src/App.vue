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
  // DEBUG: Log what is received
  console.log('[App.vue] updateSelectedCity received:', cityObject);
  currentSelectedCityObject.value = cityObject;
};

// DEBUG: Watch the object and what's being derived for props
watch(currentSelectedCityObject, (newVal) => {
  console.log('[App.vue] currentSelectedCityObject changed to:', newVal);
  console.log('[App.vue] Derived selectedCityFilter for prop:', newVal?.value);
  console.log('[App.vue] Derived selectedCityDisplayName for prop:', newVal?.name);
}, { deep: true }); // Use deep watch if the object itself might be mutated (though not expected here)


onMounted(() => {
  console.log('--- APP.VUE MOUNTED ---');
  console.log('RAW VITE_WP_USERNAME FROM ENV (App.vue):', import.meta.env.VITE_WP_USERNAME);
  console.log('RAW VITE_WP_APP_PASSWORD FROM ENV (App.vue):', import.meta.env.VITE_WP_APP_PASSWORD);
  console.log('ALL ENV VARS (App.vue):', import.meta.env);
  console.log('--- END APP.VUE MOUNTED ---');
});
</script>