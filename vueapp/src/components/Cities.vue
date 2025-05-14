<template>
  <v-card class="mx-auto" max-width="200">
    <h1>Locaties in de randstad</h1>
    <v-list role="list">
      <v-list-item
        v-for="locatie in locaties"
        :key="locatie.value"
        @click="selectLocation(locatie.value)"
        :active="selectedCityValue === locatie.value" 
        color="primary"
        role="listitem"
        tabindex="0"
      >
        <v-list-item-title> {{ locatie.name }} </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['city-selected']);

const locaties = ref([
  { name: 'Alphen a/d Rijn', value: 'Alphen a/d rijn' },
  { name: 'Amsterdam', value: 'Amsterdam' },
  { name: 'Delft', value: 'Delft' },
  { name: 'Den Haag', value: 'Den Haag' },
  { name: 'Heemstede', value: 'Heemstede' },
  { name: 'Oegstgeest', value: 'Oegstgeest' },
  { name: 'Rijswijk', value: 'Rijswijk' },
]);

const selectedCityValue = ref(null);

const selectLocation = (cityValue) => {
  selectedCityValue.value = cityValue;
  const selectedLocatieObject = locaties.value.find(loc => loc.value === cityValue);
  if (selectedLocatieObject) {
    emit('city-selected', selectedLocatieObject);
  }
};
</script>

<style scoped >
.v-card.mx-auto {
  max-width: 960px !important;
  border-radius: $border-radius-default !important;
  margin: 2em !important;
  padding: 2em;
}

.mx-auto .v-list {
  display: flex !important;
  flex-direction: column !important;
  flex-wrap: wrap !important;
}

@media (min-width:600px) {
  .mx-auto .v-list {
    height: 15em !important;
  }
}

@media (min-width: 850px) {
  .mx-auto .v-list {
    height: 10em;
  }
}

@media (min-width:960px) {
  .v-card.mx-auto {
    margin: 2em auto !important;
  }
}

h1 {
  font-size: clamp(1.5625rem, 1.027rem + 2.2549vw, 3rem) !important;
  padding: 0 16px;
  height: 4em;
  width: clamp(200px, 40%, 400px);
}

.mx-auto .v-list-item {
  height: 2em;
}

.mx-auto .v-list-item-title {
  font-size: clamp(1.2rem, -2.2593rem + 377.9341vw, 1.5rem) !important;
  border-bottom: solid 1px $stepper-title-color;
  width: max-content;
}

.v-list-item:hover,
.v-list-item:focus,
.v-list-item:active {
  color: $primary-color !important;
  cursor: pointer;
}
</style>