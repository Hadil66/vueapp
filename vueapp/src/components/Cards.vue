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
            <v-date-picker 
              v-model="selectedDate"
              :first-day-of-week="1"
              hide-header
              :allowed-dates="allowedDates"
              @update:model-value="onDateSelected" 
              
              color= "primary"
            />
              <v-card-text v-if="selectedDate">
              <h3>Beschikbare tijdsloten voor  
                {{ new Date(selectedDate).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long' }) }}
              </h3> 
            </v-card-text>
            <v-select
              v-if="selectedDate"
              v-model="selectedTimeSlot"
              :items="availableTimeSlots"
              label="Selecteer een tijdslot"
              :disabled="!selectedDate"
              multiple
            >
            </v-select>
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
  import { ref } from 'vue';

  const ruimtes = [
    "Vergaderruimte 1",
    "Vergaderruimte 2",
    "Vergaderruimte 3",
    "Vergaderruimte 4",
    "Vergaderruimte 5",
    "Vergaderruimte 6",
    "Vergaderruimte 7",
  ];

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

  const allowedDates = (date) => {
    const day = new Date(date).getDay();
    return day !== 0 && day !== 6;
  };

  const formattedSelectedDate = computed(() => {
    if (!selectedDate.value) return '';
    const date = selectedDate.value instanceof Date ? selectedDate.value : new Date(selectedDate.value);
    return date.toLocaleDateString('nl-NL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  });

  const onDateSelected = (newDate) => {
    selectedTimeSlot.value = null;
    availableTimeSlots.value = [...possibleTimeSlots]; 
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

  .v-select .v-field {
    width: 18em !important;
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
