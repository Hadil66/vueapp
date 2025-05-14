<template>
  <div>
    <h2 class="stepper-title">Stap 2: Controleer uw selectie</h2>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="7">
        <div v-if="canProceed && selectedRoomObject">
          <v-card class="p">
            <p class="mb-3 d-flex align-center">
              <v-icon icon="mdi-map-marker-outline" class="mr-2 detail-icon"></v-icon>
              <strong class="mr-1">Gekozen Ruimte:</strong>
              <span>{{ selectedRoomObject?.fullName }}</span>
            </p>
            <p class="mb-3 d-flex align-center">
              <v-icon icon="mdi-calendar-blank-outline" class="mr-2 detail-icon"></v-icon>
              <strong class="mr-1">Datum:</strong>
              <span>{{ formattedSelectedDateLong }}</span>
            </p>
            <p class="mb-0 d-flex align-center">
              <v-icon icon="mdi-clock-time-four-outline" class="mr-2 detail-icon"></v-icon>
              <strong class="mr-1">Geselecteerde Tijd(en):</strong>
              <span>{{ timeSelection.join(", ") }}</span>
            </p>
          </v-card>
          <p class="text-caption text-center mt-4">
            Klopt alles? Klik op 'Volgende' om door te gaan.
          </p>
        </div>
        <div v-else>
          <v-alert type="warning" variant="tonal"
            text="Selectie onvolledig. Ga a.u.b. terug naar stap 1 en selecteer een ruimte, datum en minimaal één beschikbare tijd."></v-alert>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
defineProps({
  selectedRoomObject: { type: Object, default: null },
  formattedSelectedDateLong: { type: String, default: '' },
  timeSelection: { type: Array, default: () => [] },
  canProceed: { type: Boolean, default: false }
});
</script>

<style lang="scss" scoped>
  .stepper-title {
    font-size: $font-size-large;
    font-weight: 500;
    color: $stepper-title-color;
    margin-bottom: $spacing-medium;
    text-align: center;
  }

  p {
    padding: 6px;
  }
</style>