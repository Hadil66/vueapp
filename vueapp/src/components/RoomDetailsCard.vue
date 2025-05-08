<template>
  <v-card v-if="props.selectedRoomObject" class="pa-3 mt-2 meeting-room-card" flat border>
    <v-img
      :src="props.selectedRoomObject.imageSrc || '/images/placeholder.png'"
      :alt="props.selectedRoomObject.fullName + ' afbeelding'"
      height="150px"
      cover
      class="mb-3 rounded-lg meeting-room-detail-image"
    >
      <template #placeholder>
        <v-img src="/images/placeholder.png" height="150px" cover alt="Laden..."></v-img>
      </template>
      <template #error>
        <v-img src="/images/placeholder.png" height="150px" cover alt="Fout"></v-img>
      </template>
    </v-img>
    <v-card-title class="text-h6 text-center pt-0 pb-1">
      {{ props.selectedRoomObject.fullName }}
    </v-card-title>
    <v-card-text
      class="text-body-2 text-center pb-1"
      v-html="props.selectedRoomObject.description"
    ></v-card-text>
    <v-card-text class="text-body-2 text-center pt-0">
      Capaciteit: <strong>{{ props.selectedRoomObject.capacity }} personen</strong>
    </v-card-text>
    <v-card-text
      class="text-body-2 text-center pt-0"
      v-if="props.selectedRoomObject.features && props.selectedRoomObject.features.length"
    >
      Features: <strong>{{ props.selectedRoomObject.features.join(", ") }}</strong>
    </v-card-text>
  </v-card>
</template>

<script setup>
const props = defineProps({
  selectedRoomObject: { type: Object, default: null },
});
</script>
