<template>
  <div>
    <h2 class="stepper-title">Stap 3: Opmerking & Reserveren</h2>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="7">
        <h3>Opmerking toevoegen (optioneel)</h3>
        <v-textarea v-model="localComment" label="Voeg hier eventuele opmerkingen toe" rows="3" variant="outlined"
          class="mt-2 mb-6" clearable counter maxlength="200" :disabled="isSubmittingBooking"></v-textarea>
        <v-divider class="mb-6"></v-divider>
        <p class="text-center">
          Klik hieronder om uw reservering definitief te maken.
        </p>
        <v-btn color="success" size="large" class="mt-4" block @click="handleSubmit" :loading="isSubmittingBooking"
          :disabled="isSubmittingBooking">
          Reserveer Vergaderruimte
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  isSubmittingBooking: { type: Boolean, default: false },
  reservationCommentProp: { type: String, default: '' }
});
const emit = defineEmits(['update:reservationCommentProp', 'submit-booking-requested']);

const localComment = computed({
  get: () => props.reservationCommentProp,
  set: (value) => emit('update:reservationCommentProp', value)
});

const handleSubmit = () => {
  emit('submit-booking-requested');
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
</style>