<template>
  <div v-if="!props.selectedDate" class="pa-4 mt-2 text-grey-darken-1 text-center time-list-placeholder">
    Selecteer eerst een datum.
  </div>
  <div v-else-if="props.isLoadingTimes" class="pa-4 mt-2 text-grey-darken-1 text-center time-list-placeholder">
    <v-progress-circular indeterminate color="primary" size="32"></v-progress-circular>
    <p class="ml-2 align-self-center text-caption">Tijden laden...</p>
  </div>
  <v-list v-else density="compact" class="mt-2 time-list" lines="one">
    <v-list-subheader>
      Beschikbare tijden op {{ props.formattedSelectedDateShort }}
    </v-list-subheader>
    <v-list-item v-for="time in props.staticPossibleTimeSlots" :key="time" :value="time" rounded="lg"
      class="mb-1 time-list-item" :class="{
        'time-slot-booked': props.isTimeSlotBookedFn(time),
        'time-slot-selected': localTimeSelection.includes(time),
      }" :disabled="props.isTimeSlotBookedFn(time)" @click="toggleTimeSelection(time)">
      <template #prepend>
        <v-list-item-action start class="mr-2">
          <v-checkbox-btn :model-value="localTimeSelection.includes(time)" :disabled="props.isTimeSlotBookedFn(time)"
            readonly></v-checkbox-btn>
        </v-list-item-action>
      </template>
      <v-list-item-title :class="{ 'booked-text': props.isTimeSlotBookedFn(time) }">
        {{ time }}
        <v-chip v-if="props.isPopularFn(time)" size="x-small" color="orange" variant="flat"
          class="ml-2 popular-chip">Populair</v-chip>
      </v-list-item-title>
    </v-list-item>
    <p v-if="
      props.staticPossibleTimeSlots.length > 0 && props.allTimesBookedForDate
    " class="text-caption text-orange text-center pa-4">
      Alle tijden zijn volgeboekt op deze datum.
    </p>
    <p v-if="props.staticPossibleTimeSlots.length === 0 && !props.isLoadingTimes"
      class="text-caption text-grey text-center pa-4">
      Geen tijdsloten geconfigureerd.
    </p>
  </v-list>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  selectedDate: { type: [Date, String, null], default: null },
  formattedSelectedDateShort: { type: String, default: "" },
  staticPossibleTimeSlots: { type: Array, required: true },
  bookedSlots: { type: Array, default: () => [] },
  modelValue: { type: Array, default: () => [] },
  isLoadingTimes: { type: Boolean, default: false },
  allTimesBookedForDate: { type: Boolean, default: false },
  popularTimeSlotsSet: { type: Set, default: () => new Set() },
  isTimeSlotBookedFn: { type: Function, required: true },
  isPopularFn: { type: Function, required: true },
});

const emit = defineEmits(["update:modelValue"]);

const localTimeSelection = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const toggleTimeSelection = (time) => {
  if (props.isTimeSlotBookedFn(time)) return;

  const newSelection = [...localTimeSelection.value];
  const index = newSelection.indexOf(time);
  if (index > -1) {
    newSelection.splice(index, 1);
  } else {
    newSelection.push(time);
  }
  localTimeSelection.value = newSelection;
};
</script>
