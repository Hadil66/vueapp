<template>
  <div>
    <h3 class="stepper-title">Stap 2: Controleer uw selectie</h3>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="7">
        <div v-if="canProceed && selectedRoomObject">
          <v-card variant="outlined" class="pa-4">
            <p class="mb-2">
              <strong>Gekozen Ruimte:</strong>
              {{ selectedRoomObject?.fullName }}
            </p>
            <p class="mb-2">
              <strong>Datum:</strong> {{ formattedSelectedDateLong }}
            </p>
            <p class="mb-0">
              <strong>Geselecteerde Tijd(en):</strong>
              {{ timeSelection.join(", ") }}
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
</style>