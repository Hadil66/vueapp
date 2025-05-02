<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="4">
        <v-card class="features">
          <div class="feature-1" tabindex="0">
            feature 1
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
          </div>
          <div class="feature-2" tabindex="0">feature 2</div>
          <div class="feature-3" tabindex="0">
            feature 3
            <v-date-picker
              v-model="selectedDate"
              :first-day-of-week="1"
              hide-header
              :allowed-dates="allowedDates"
              @update:model-value="onDateSelected"
              color="primary"
            />
          </div>
          <div class="feature-4" tabindex="0">
            feature 4
            <v-list v-model:selected="timeSelection"  v-if="selectedDate">
              <v-list-subheader>
                Beschikbare tijdsloten voor
                {{
                  new Date(selectedDate).toLocaleDateString("nl-NL", {
                    day: "numeric",
                    month: "long",
                  })
                }}
              </v-list-subheader>
              <v-list-item v-for="time in possibleTimeSlots" :key="time" :value="time">
                <template v-slot:prepend="{ isSelected, select }">
                  <v-list-item-action start>
                    <v-checkbox-btn
                      :model-value="isSelected"
                      @click.stop="select(!isSelected)"
                    ></v-checkbox-btn>
                  </v-list-item-action>
                </template>

                <v-list-item-title>{{ time }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </div>
          <p>gekozen locatie + ruimte + datum + tijd</p>
          <v-btn> Submit </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from "vue";

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
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
];

const allowedDates = (date) => {
  const day = new Date(date).getDay();
  return day !== 0 && day !== 6;
};

const formattedSelectedDate = computed(() => {
  if (!selectedDate.value) return "";
  const date =
    selectedDate.value instanceof Date
      ? selectedDate.value
      : new Date(selectedDate.value);
  return date.toLocaleDateString("nl-NL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
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

.feature-1,
.feature-2,
.feature-3,
.feature-4 {
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
  .feature-1,
  .feature-2,
  .feature-3,
  .feature-4 {
    margin: 16px;
  }
}

@media (min-width: 850px) {
  .features {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr) !important;
    grid-template-rows: repeat(2, 1fr) !important;
    gap: 10px !important;
  }
}

@media (min-width: 960px) {
  .v-col-md-4 {
    flex: none !important;
    max-width: none !important;
  }
}
</style>
