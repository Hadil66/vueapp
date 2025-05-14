<template>
  <div>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="7">
        <v-sheet v-if="lastBookingDetails" rounded="lg" class="pa-md-6 pa-4" elevation="2">
          <v-alert
            type="success"
            icon="$success"
            title="Reservering Succesvol!"
            :text="confirmationMessage"
            class="mb-6"
            density="comfortable"
          ></v-alert>

          <div class="mb-6">
            <h3 class="text-h6 font-weight-medium mb-3">Uw Reserveringsdetails</h3>

            <v-list lines="one" density="compact">
              <v-list-item class="px-0">
                <template v-slot:prepend>
                  <v-icon icon="mdi-map-marker-outline" class="mr-3"></v-icon>
                  <strong class="mr-2">Ruimte:</strong>
                </template>
                <v-list-item-title>{{ lastBookingDetails.roomName }}</v-list-item-title>
              </v-list-item>

              <v-list-item class="px-0">
                <template v-slot:prepend>
                  <v-icon icon="mdi-calendar-blank-outline" class="mr-3"></v-icon>
                  <strong class="mr-2">Datum:</strong>
                </template>
                <v-list-item-title>{{ lastBookingDetails.formattedDate }}</v-list-item-title>
              </v-list-item>

              <v-list-item class="px-0">
                <template v-slot:prepend>
                  <v-icon icon="mdi-clock-time-four-outline" class="mr-3"></v-icon>
                  <strong class="mr-2">Tijd(en):</strong>
                </template>
                <v-list-item-title>{{ lastBookingDetails.times?.join(", ") }}</v-list-item-title>
              </v-list-item>

              <v-list-item v-if="lastBookingDetails.comment" class="px-0">
                <template v-slot:prepend>
                  <v-icon icon="mdi-comment-text-outline" class="mr-3"></v-icon>
                  <strong class="mr-2">Opmerking:</strong>
                </template>
                <v-list-item-title class="text-wrap">{{ lastBookingDetails.comment }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </div>

          <div class="text-center">
            <v-btn
              color="primary"
              @click="handleNewReservation"
              size="large"
              prepend-icon="mdi-plus-circle-outline"
            >
              Nieuwe Reservering Maken
            </v-btn>
          </div>
        </v-sheet>
        <v-alert v-else type="info" variant="tonal">
          Geen bevestigingsdetails beschikbaar of er is een fout opgetreden.
        </v-alert>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  lastBookingDetails: { type: Object, default: null }
});
const emit = defineEmits(['new-reservation-requested']);

const confirmationMessage = computed(() => {
  if (!props.lastBookingDetails) return '';
  return props.lastBookingDetails.isApiBooking
    ? 'Uw reservering is succesvol verwerkt en opgeslagen.'
    : 'Uw reservering is succesvol (gesimuleerd) verwerkt.';
});

const handleNewReservation = () => {
  emit('new-reservation-requested');
};
</script>

<style lang="scss" scoped>


  .stepper-title {
    font-size: $font-size-large;
    font-weight: 500;
    color: $stepper-title-color;
    margin-bottom: $spacing-medium;
    text-align: center;
  }

.v-alert {
  background-color: $secundary-color !important;
  color: $dark !important;
}

.text-wrap {
  white-space: normal;
}
</style>