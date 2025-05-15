<template>
  <v-card class="mx-auto" max-width="200">
    <h1>Vergaderlocaties in de randstad</h1>
    <ul role="list">
      <li
        v-for="locatie in locaties"
        :key="locatie.value"
        @click="selectLocation(locatie.value)"
        :active="selectedCityValue === locatie.value"
        color="primary"
        role="listitem"
        tabindex="0"
      >
        {{ locatie.name }}
    </li>
    </ul>
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

<style scoped lang="scss">
.v-card.mx-auto {
  max-width: 960px !important;
  border-radius: $border-radius-default !important;
  margin: 2em !important;
  padding: 2em;
}

.mx-auto ul {
  display: flex !important;
  flex-direction: column !important;
  flex-wrap: wrap !important;
}

@media (min-width:600px) {
  .mx-auto ul {
    height: 15em !important;
  }
}

@media (min-width: 850px) {
  .mx-auto .ul {
    height: 10em;
  }
}

@media (min-width:960px) {
  .v-card.mx-auto {
    margin: 2em auto !important;
  }
}

h1 {
  font-size: clamp(1.5625rem, 1.027rem + 2.2549vw, 3rem);
  padding: 0 16px;
  height: 4em;
  width: clamp(255px, 60%, 500px);
}

.mx-auto li {
  padding: 0.3em;
  list-style-type: none;
  font-size: clamp(1.2rem, -2.2593rem + 377.9341vw, 1.5rem);
  border-bottom: solid 1px $stepper-title-color;
  width: 10em;
}

li:hover,
li:focus,
li:active {
  color: $primary-color;
  cursor: pointer;
}
</style>