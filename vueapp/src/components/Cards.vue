<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="4">
        <v-card class="features">
          <v-carousel hide-delimiters>
            <v-carousel-item v-for="(ruimte, index) in ruimtes" :key="index">
              <div class="container">
                <v-card-title>{{ ruimte }}</v-card-title>
                <v-card-subtitle>Max aantal personen</v-card-subtitle>  
                <v-img alt="placeholder" class="placeholder-image"></v-img>
                <v-card-text> Meer ruimte informatie </v-card-text>
              </div>
            </v-carousel-item>
          </v-carousel>
          <div class="feature" tabindex="0"> feature 1
            <v-date-picker v-model="selectedDate"
              title="Selecteer een datum en tijd"
              :allowed-dates="allowedDates"
              @update:model-value="onDateSelected" 
              multiple
              color= "primary"
            />
            <v-card-text v-if="selectedDate && selectedDate.length"> <h3 class="mb-4">Beschikbare Tijdsloten</h3> </v-card-text>
            <v-select
              v-if="selectedDate && selectedDate.length"
              v-model="selectedTimeSlot"
              :items="availableTimeSlots"
              label="Selecteer een tijdslot"
              :disabled="!selectedDate"
              multiple
              no-data-text="Selecteer eerst een datum"
            >
            </v-select>

            <v-alert
              v-if="selectedDate && availableTimeSlots.length === 0 && !loadingTimeSlots"
              type="warning"
              dense
              text
              class="mt-4"
            >
              Geen tijdsloten beschikbaar voor deze datum.
            </v-alert>

          </div>
          <div class="feature" tabindex="0">feature 2</div>
          <div class="feature" tabindex="0">feature 3</div>
          <div class="feature" tabindex="0">feature 4</div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const ruimtes = [
  "Ruimte 1",
  "Ruimte 2",
  "Ruimte 3",
  "Ruimte 4",
  "Ruimte 5",
  "Ruimte 6",
  "Ruimte 7",
];

// --- Data Refs ---
const selectedDate = ref(null); 
const selectedTimeSlot = ref(null); 
const availableTimeSlots = ref([]); 
const loadingTimeSlots = ref(false); 
const possibleTimeSlots = [
  '09:00 - 10:00',
  '10:00 - 11:00',
  '11:00 - 12:00',
  '13:00 - 14:00',
  '14:00 - 15:00',
  '15:00 - 16:00',
  '16:00 - 17:00',
];

// --- Computed Property for Display ---
const formattedSelectedDate = computed(() => {
  if (!selectedDate.value) return '';
  // Make sure selectedDate.value is a Date object before formatting
  const date = selectedDate.value instanceof Date ? selectedDate.value : new Date(selectedDate.value);
  return date.toLocaleDateString('nl-NL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

// --- Methods ---

// Function to simulate fetching slots for a date
const fetchAvailableSlots = async (date) => {
  if (!date) {
    availableTimeSlots.value = [];
    return;
  }
  loadingTimeSlots.value = true;
  // --- FAKE AVAILABLE TIMES ---
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

  // Example logic: Maybe weekends have fewer slots, or fetch real data
  const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
  if (dayOfWeek === 0 || dayOfWeek === 6) {
     // Simulate fewer slots on weekends
     availableTimeSlots.value = ['10:00 - 11:00', '11:00 - 12:00'];
  } else {
    // Simulate different slots on specific dates (example)
    if (date.getDate() % 5 === 0) { // Just a silly example
        availableTimeSlots.value = ['09:00 - 10:00', '13:00 - 14:00', '14:00 - 15:00'];
    } else {
        availableTimeSlots.value = [...possibleTimeSlots]; 
    }
  }
  // --- END SIMULATION ---
  loadingTimeSlots.value = false;
};

// Called when the date picker value changes
const onDateSelected = (newDate) => {
   // When a new date is selected, reset the time slot
   selectedTimeSlot.value = null;
   // Fetch slots for the new date
   if (newDate) {
      // Ensure newDate is a Date object if needed by your fetch logic
      const dateObj = newDate instanceof Date ? newDate : new Date(newDate);
      fetchAvailableSlots(dateObj);
   } else {
      availableTimeSlots.value = []; // Clear slots if date is cleared
   }
};
</script>

<style>
  .v-window {
    height: auto !important;
    margin: 10px;
  }

  .v-window__container {
    align-items: center;
  }

  .v-window__controls {
    position: relative !important;
    max-width: 20em !important;
  }

  .v-btn {
    margin: 5px;
  }

  .v-card {
    margin: 0 !important;
    max-width: none !important;
  }

  .features {
    border-radius: 8px !important;
    width: 80% !important;
    margin: 0 auto !important;
    padding: 16px !important;
  }

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .placeholder-image {
    border-radius: 8px !important;
    background-image: url("@/assets/placeholder.png");
    background-size: cover;
    background-position: center;
    height: 9em;
    width: 8em;
    border: solid 1px #ff7c00;
  }

  .v-card-text {
    padding: 16px 0 !important;
  }

  .feature {
    text-align: center;
    border-radius: 8px !important;
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 6em;
    border: 1px solid #ff7c00;
    transition: 0.3s;
  }

  @media (max-width: 849px) {
    .feature {
      margin: 16px;
    }
  }

  .feature:hover {
    -webkit-box-shadow: 2px 2px 16px 0px rgba(148, 148, 148, 0.7);
    cursor: pointer;
  }

  @media (min-width: 850px) {
    .features {
      display: grid !important;
      grid-template-columns: repeat(3, 1fr) !important;
      grid-template-rows: repeat(2, 1fr) !important;
      grid-column-gap: 10px !important;
      grid-row-gap: 0px !important;
    }

    .v-carousel {
      grid-area: 1 / 1 / 3 / 2 !important;
    }
    .feature:nth-of-type(1) {
      grid-area: 1 / 2 / 2 / 3 !important;
      margin-top: 1rem !important;
    }
    .feature:nth-of-type(2) {
      grid-area: 1 / 3 / 2 / 4 !important;
      margin-top: 1rem !important;
    }
    .feature:nth-of-type(3) {
      grid-area: 2 / 2 / 3 / 3 !important;
    }
    .feature:nth-of-type(4) {
      grid-area: 2 / 3 / 3 / 4 !important;
    }
  }

  @media (min-width: 960px) {
    .v-col-md-4 {
      flex: none !important;
      max-width: none !important;
    }
  }
</style>
