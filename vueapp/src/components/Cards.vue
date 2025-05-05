<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="11" lg="10">
        <v-stepper
          prev-text="Vorige"
          next-text="Volgende"
          v-model="currentStep"
          :items="stepperItems"
          alt-labels
        >
          <!-- Wrap all step content items in v-stepper-window -->
          <v-stepper-window>
            <!-- Step 1: Select Room, Date, Time -->
            <v-stepper-window-item :value="1">
              <h3 class="stepper-title">Stap 1: Kies Ruimte, Datum & Tijd</h3>
              <v-row>
                <!-- Room Selection -->
                <v-col cols="12">
                  <h4>Kies een vergaderruimte</h4>
                  <v-sheet class="mx-auto room-slider-sheet" width="100%">
                    <v-slide-group
                      v-model="selectedVergaderruimteId"
                      center-active
                      show-arrows
                      class="py-2"
                    >
                      <v-slide-group-item
                        v-for="ruimte in ruimtes"
                        :key="ruimte.id"
                        :value="ruimte.id"
                        v-slot="{ isSelected, toggle }"
                      >
                        <v-card
                          :color="isSelected ? 'primary' : 'grey-lighten-4'"
                          :variant="isSelected ? 'elevated' : 'outlined'"
                          class="ma-3 slide-item-card"
                          height="190"
                          width="140"
                          @click="toggle"
                          :elevation="isSelected ? 4 : 0"
                        >
                          <v-img
                            :src="ruimte.imageSrc"
                            :alt="ruimte.name + ' afbeelding'"
                            height="120"
                            cover
                            class="slide-item-image"
                          >
                            <template v-slot:placeholder
                              ><v-img
                                src="/images/placeholder.png"
                                height="120"
                                cover
                                alt="Laden..."
                              ></v-img
                            ></template>
                            <template v-slot:error
                              ><v-img
                                src="/images/placeholder.png"
                                height="120"
                                cover
                                alt="Fout"
                              ></v-img
                            ></template>
                          </v-img>
                          <v-card-subtitle
                            class="pt-3 pb-1 text-center slide-item-name"
                            >{{ ruimte.name }}</v-card-subtitle
                          >
                          <v-card-text class="text-caption text-center pa-0"
                            >Max: {{ ruimte.capacity }} pers.</v-card-text
                          >
                        </v-card>
                      </v-slide-group-item>
                    </v-slide-group>
                  </v-sheet>
                </v-col>

                <!-- Details, Date, Time (Shown only after room selection) -->
                <v-col cols="12" v-if="selectedVergaderruimteId">
                  <v-divider class="my-4"></v-divider>
                  <v-row>
                    <v-col cols="12" md="5">
                      <h4>Gekozen Ruimte Details</h4>
                      <v-card
                        class="vergaderruimteCard pa-3 mt-2"
                        v-if="selectedRoomObject"
                        flat
                        border
                      >
                        <v-img
                          :src="selectedRoomObject.imageSrc"
                          :alt="selectedRoomObject.fullName + ' afbeelding'"
                          height="150px"
                          cover
                          class="mb-3 rounded-lg detail-image"
                        >
                          <template v-slot:placeholder
                            ><v-img
                              src="/images/placeholder.png"
                              height="150px"
                              cover
                              alt="Laden..."
                            ></v-img
                          ></template>
                          <template v-slot:error
                            ><v-img
                              src="/images/placeholder.png"
                              height="150px"
                              cover
                              alt="Fout"
                            ></v-img
                          ></template>
                        </v-img>
                        <v-card-title class="text-h6 text-center pt-0 pb-1">{{
                          selectedRoomObject.fullName
                        }}</v-card-title>
                        <v-card-text class="text-body-2 text-center pb-1">{{
                          selectedRoomObject.description
                        }}</v-card-text>
                        <v-card-text class="text-body-2 text-center pt-0"
                          >Capaciteit:
                          <strong
                            >{{ selectedRoomObject.capacity }} personen</strong
                          ></v-card-text
                        >
                      </v-card>
                    </v-col>
                    <v-col cols="12" md="7">
                      <v-row>
                        <v-col cols="12" sm="6">
                          <h4>Selecteer Datum</h4>
                          <v-date-picker
                            v-model="selectedDate"
                            :first-day-of-week="1"
                            show-adjacent-months
                            hide-header
                            :allowed-dates="allowedDates"
                            @update:model-value="onDateSelected"
                            color="primary"
                            class="mt-2 mx-auto date-picker-custom"
                            :disabled="!selectedRoomObject"
                            :min="todayDateString"
                            width="100%"
                          />
                        </v-col>
                        <v-col cols="12" sm="6">
                          <h4>Selecteer Tijd(en)</h4>
                          <div
                            v-if="!selectedDate"
                            class="pa-4 mt-2 text-grey-darken-1 text-center time-list-placeholder"
                          >
                            Selecteer eerst een datum.
                          </div>
                          <v-list
                            v-else
                            density="compact"
                            class="mt-2 time-list"
                            lines="one"
                          >
                            <v-list-subheader
                              >Beschikbare tijden op
                              {{ formattedSelectedDateShort }}</v-list-subheader
                            >
                            <v-list-item
                              v-for="time in staticPossibleTimeSlots"
                              :key="time"
                              :value="time"
                              rounded="lg"
                              class="mb-1 time-list-item"
                              :class="{
                                'time-slot-booked': isTimeSlotBooked(time),
                                'time-slot-selected': timeSelection.includes(time),
                              }"
                              :disabled="isTimeSlotBooked(time)"
                              @click="toggleTimeSelection(time)"
                            >
                              <template v-slot:prepend>
                                <v-list-item-action start class="mr-2">
                                  <v-checkbox-btn
                                    :model-value="timeSelection.includes(time)"
                                    :disabled="isTimeSlotBooked(time)"
                                    readonly
                                  ></v-checkbox-btn>
                                </v-list-item-action>
                              </template>
                              <v-list-item-title
                                :class="{ 'booked-text': isTimeSlotBooked(time) }"
                              >
                                {{ time }}
                                <v-chip
                                  v-if="isPopular(time)"
                                  size="x-small"
                                  color="orange"
                                  variant="flat"
                                  class="ml-2 popular-chip"
                                  >Populair</v-chip
                                >
                              </v-list-item-title>
                            </v-list-item>
                            <p
                              v-if="allTimesBookedForDate"
                              class="text-caption text-orange text-center pa-4"
                            >
                              Alle tijden zijn volgeboekt op deze datum.
                            </p>
                          </v-list>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-stepper-window-item>

            <!-- Step 2: Verify Selection -->
            <v-stepper-window-item :value="2">
              <h3 class="stepper-title">Stap 2: Controleer uw selectie</h3>
              <v-row justify="center">
                <v-col cols="12" md="8" lg="7">
                  <div v-if="canProceedToStep2">
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
                    <v-alert
                      type="warning"
                      variant="tonal"
                      text="Selectie onvolledig. Ga a.u.b. terug naar stap 1 en selecteer een ruimte, datum en minimaal één beschikbare tijd."
                    ></v-alert>
                  </div>
                </v-col>
              </v-row>
            </v-stepper-window-item>

            <!-- Step 3: Add Comment & Reserve -->
            <v-stepper-window-item :value="3">
              <h3 class="stepper-title">Stap 3: Opmerking & Reserveren</h3>
              <v-row justify="center">
                <v-col cols="12" md="8" lg="7">
                  <h4>Opmerking toevoegen (optioneel)</h4>
                  <v-textarea
                    v-model="reservationComment"
                    label="Voeg hier eventuele opmerkingen toe"
                    rows="3"
                    variant="outlined"
                    class="mt-2 mb-6"
                    clearable
                    counter
                    maxlength="200"
                  ></v-textarea>
                  <v-divider class="mb-6"></v-divider>
                  <p class="text-center">
                    Klik hieronder om uw reservering definitief te maken.
                  </p>
                  <v-btn
                    color="success"
                    size="large"
                    class="mt-4"
                    block
                    @click="submitBooking"
                  >
                    Reserveer Vergaderruimte
                  </v-btn>
                </v-col>
              </v-row>
            </v-stepper-window-item>

            <!-- Step 4: Confirmation -->
            <v-stepper-window-item :value="4">
              <h3 class="stepper-title">Reservering Bevestigd</h3>
              <v-row justify="center">
                <v-col cols="12" md="8" lg="7">
                  <v-alert
                    type="success"
                    title="Reservering Succesvol"
                    text="Uw reservering is succesvol (gesimuleerd) verwerkt."
                    variant="tonal"
                    class="mb-4"
                    border="start"
                  ></v-alert>
                  <v-card variant="outlined" class="pa-4 mb-6">
                    <p><strong>Ruimte:</strong> {{ lastBookingDetails?.roomName }}</p>
                    <p><strong>Datum:</strong> {{ lastBookingDetails?.formattedDate }}</p>
                    <p>
                      <strong>Tijd(en):</strong>
                      {{ lastBookingDetails?.times?.join(", ") }}
                    </p>
                    <p v-if="lastBookingDetails?.comment">
                      <strong>Opmerking:</strong> {{ lastBookingDetails.comment }}
                    </p>
                  </v-card>
                  <v-btn color="primary" @click="resetStepper" block
                    >Nieuwe Reservering Maken</v-btn
                  >
                </v-col>
              </v-row>
            </v-stepper-window-item>
          </v-stepper-window>
          <!-- End of v-stepper-window -->
        </v-stepper>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const currentStep = ref(1);
const selectedVergaderruimteId = ref(null);
const selectedDate = ref(null);
const timeSelection = ref([]);
const reservationComment = ref("");
const lastBookingDetails = ref(null);

const stepperItems = ref([
  { title: "Selecteer", value: 1 },
  { title: "Controleer", value: 2 },
  { title: "Reserveer", value: 3 },
]);

const formatDateISO = (dateInput) => {
  if (!dateInput) return null;
  let date;
  try {
    date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    if (isNaN(date.getTime())) return null;
  } catch (e) {
    return null;
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const todayDateString = computed(() => formatDateISO(new Date()));
const staticPossibleTimeSlots = [
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
];
const getRandomBookings = (daysAhead, maxSlotsPerDay) => {
  const bookings = [];
  const today = new Date();
  for (let i = 1; i <= daysAhead; i++) {
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + i);
    const dateStr = formatDateISO(targetDate);
    if (!dateStr) continue;
    const shouldHaveBooking = Math.random() < 0.6;
    if (shouldHaveBooking) {
      const numberOfSlotsToBook = Math.floor(Math.random() * (maxSlotsPerDay + 1));
      if (numberOfSlotsToBook > 0) {
        const availableSlots = [...staticPossibleTimeSlots];
        const bookedTimes = [];
        for (let j = 0; j < numberOfSlotsToBook && availableSlots.length > 0; j++) {
          const randomIndex = Math.floor(Math.random() * availableSlots.length);
          bookedTimes.push(availableSlots.splice(randomIndex, 1)[0]);
        }
        if (bookedTimes.length > 0)
          bookings.push({ date: dateStr, times: bookedTimes.sort() });
      }
    }
    if (i % 5 === 0 && Math.random() < 0.3) {
      const existingIndex = bookings.findIndex((b) => b.date === dateStr);
      if (existingIndex !== -1)
        bookings[existingIndex].times = [...staticPossibleTimeSlots];
      else bookings.push({ date: dateStr, times: [...staticPossibleTimeSlots] });
    }
  }
  return bookings.sort((a, b) => a.date.localeCompare(b.date));
};
const ruimtes = ref([
  {
    id: 1,
    name: "Alpha",
    fullName: "Vergaderruimte Alpha",
    description: "Gezellige kamer voor kleine teams.",
    capacity: 4,
    features: ["Whiteboard", "Wi-Fi", "Airco"],
    imageSrc: "/images/room_alpha.png",
    bookings: getRandomBookings(14, 3),
  },
  {
    id: 2,
    name: "Beta",
    fullName: "Vergaderruimte Beta",
    description: "Middelgrote kamer met projector.",
    capacity: 8,
    features: ["Projector", "Scherm", "Wi-Fi", "Koffie"],
    imageSrc: "/images/room_beta.png",
    bookings: getRandomBookings(14, 5),
  },
  {
    id: 3,
    name: "Gamma",
    fullName: "Vergaderruimte Gamma",
    description: "Grote conferentieruimte.",
    capacity: 16,
    features: ["Videoconferencing", "Groot scherm", "Wi-Fi"],
    imageSrc: "/images/room_gamma.png",
    bookings: getRandomBookings(14, 6),
  },
  {
    id: 4,
    name: "Delta",
    fullName: "Vergaderruimte Delta",
    description: "Flexibele workshop ruimte.",
    capacity: 10,
    features: ["Flexibel", "Whiteboard", "Wi-Fi"],
    imageSrc: "/images/room_delta.png",
    bookings: getRandomBookings(14, 4),
  },
  {
    id: 5,
    name: "Epsilon",
    fullName: "Vergaderruimte Epsilon",
    description: "Stille kamer voor focus werk.",
    capacity: 2,
    features: ["Stil", "Wi-Fi"],
    imageSrc: "/images/room_epsilon.png",
    bookings: getRandomBookings(14, 2),
  },
  {
    id: 6,
    name: "Zeta",
    fullName: "Vergaderruimte Zeta",
    description: "Creatieve ruimte met zitjes.",
    capacity: 6,
    features: ["Zitzakken", "Whiteboard", "Wi-Fi"],
    imageSrc: "/images/room_zeta.png",
    bookings: getRandomBookings(14, 3),
  },
]);

watch(selectedVergaderruimteId, (newId, oldId) => {
  if (newId !== oldId) {
    selectedDate.value = null;
    timeSelection.value = [];
    reservationComment.value = "";
  }
});

const selectedRoomObject = computed(() => {
  if (selectedVergaderruimteId.value === null) return null;
  return ruimtes.value.find((ruimte) => ruimte.id === selectedVergaderruimteId.value);
});
const bookedSlotsForSelectedDate = computed(() => {
  const room = selectedRoomObject.value;
  const dateStr = formatDateISO(selectedDate.value);
  if (!room || !dateStr) return [];
  const booking = room.bookings.find((b) => b.date === dateStr);
  return booking ? booking.times : [];
});
const allTimesBookedForDate = computed(() => {
  if (!selectedRoomObject.value || !selectedDate.value) return false;
  return bookedSlotsForSelectedDate.value.length >= staticPossibleTimeSlots.length;
});
const fullyBookedDatesForSelectedRoom = computed(() => {
  const bookedDates = new Set();
  const room = selectedRoomObject.value;
  if (!room) return bookedDates;
  for (const booking of room.bookings) {
    if (booking.times.length >= staticPossibleTimeSlots.length)
      bookedDates.add(booking.date);
  }
  return bookedDates;
});
const popularTimeSlots = computed(() => {
  const counts = {};
  let maxCount = 0;
  for (const time of staticPossibleTimeSlots) counts[time] = 0;
  for (const room of ruimtes.value) {
    for (const booking of room.bookings) {
      for (const time of booking.times) {
        if (counts[time] !== undefined) {
          counts[time]++;
          if (counts[time] > maxCount) maxCount = counts[time];
        }
      }
    }
  }
  const popularSet = new Set();
  if (maxCount > 0) {
    const popularityThreshold = Math.max(2, Math.ceil(maxCount * 0.75));
    for (const time of staticPossibleTimeSlots) {
      if (counts[time] >= popularityThreshold) popularSet.add(time);
    }
  }
  return popularSet;
});
const isTimeSlotBooked = (time) => {
  return bookedSlotsForSelectedDate.value.includes(time);
};
const isPopular = (time) => {
  return popularTimeSlots.value.has(time);
};
const allowedDates = (dateValue) => {
  const date = new Date(dateValue);
  const day = date.getDay();
  const dateStr = formatDateISO(dateValue);
  if (!dateStr) return false;
  if (dateStr < todayDateString.value) return false;
  const isWeekend = day === 0 || day === 6;
  if (isWeekend) return false;
  if (fullyBookedDatesForSelectedRoom.value.has(dateStr)) return false;
  return true;
};
const formattedSelectedDateShort = computed(() => {
  if (!selectedDate.value) return "";
  const date =
    selectedDate.value instanceof Date
      ? selectedDate.value
      : new Date(selectedDate.value);
  if (isNaN(date.getTime())) return "Ongeldige datum";
  return date.toLocaleDateString("nl-NL", { month: "long", day: "numeric" });
});
const formattedSelectedDateLong = computed(() => {
  if (!selectedDate.value) return "";
  const date =
    selectedDate.value instanceof Date
      ? selectedDate.value
      : new Date(selectedDate.value);
  if (isNaN(date.getTime())) return "Ongeldige datum";
  return date.toLocaleDateString("nl-NL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});
const onDateSelected = (newDate) => {
  const previouslySelectedDateStr = formatDateISO(selectedDate.value);
  const newDateStr = formatDateISO(newDate);
  selectedDate.value = newDate;
  if (newDate && newDateStr !== previouslySelectedDateStr) {
    const bookedSlots = bookedSlotsForSelectedDate.value;
    timeSelection.value = timeSelection.value.filter(
      (time) => !bookedSlots.includes(time)
    );
  } else if (!newDate) {
    timeSelection.value = [];
  }
};

const toggleTimeSelection = (time) => {
  if (isTimeSlotBooked(time)) return;
  const index = timeSelection.value.indexOf(time);
  if (index > -1) {
    timeSelection.value.splice(index, 1);
  } else {
    timeSelection.value.push(time);
  }
};

const canProceedToStep2 = computed(() => {
  return (
    selectedVergaderruimteId.value !== null &&
    selectedDate.value !== null &&
    timeSelection.value.length > 0
  );
});

const submitBooking = () => {
  if (!canProceedToStep2.value) {
    alert("Selecteer aub een ruimte, datum en tijdslot(en) in Stap 1.");
    currentStep.value = 1;
    return;
  }
  lastBookingDetails.value = {
    roomId: selectedRoomObject.value.id,
    roomName: selectedRoomObject.value.fullName,
    date: formatDateISO(selectedDate.value),
    formattedDate: formattedSelectedDateLong.value,
    times: [...timeSelection.value],
    comment: reservationComment.value || "",
  };
  console.log("Submitting Booking:", lastBookingDetails.value);

  // --- Simulation of updating local data ---
  const roomIndex = ruimtes.value.findIndex(
    (r) => r.id === lastBookingDetails.value.roomId
  );
  if (roomIndex > -1) {
    const dateBookingIndex = ruimtes.value[roomIndex].bookings.findIndex(
      (b) => b.date === lastBookingDetails.value.date
    );
    if (dateBookingIndex > -1) {
      const existingTimes = new Set(
        ruimtes.value[roomIndex].bookings[dateBookingIndex].times
      );
      lastBookingDetails.value.times.forEach((t) => existingTimes.add(t));
      ruimtes.value[roomIndex].bookings[dateBookingIndex].times = Array.from(
        existingTimes
      ).sort();
    } else {
      ruimtes.value[roomIndex].bookings.push({
        date: lastBookingDetails.value.date,
        times: lastBookingDetails.value.times.sort(),
      });
      ruimtes.value[roomIndex].bookings.sort((a, b) => a.date.localeCompare(b.date));
    }
    ruimtes.value = [...ruimtes.value]; // Force reactivity
  }
  currentStep.value = 4; // Move to confirmation
};

const resetStepper = () => {
  selectedVergaderruimteId.value = null;
  selectedDate.value = null;
  timeSelection.value = [];
  reservationComment.value = "";
  lastBookingDetails.value = null;
  currentStep.value = 1;
};
</script>

<style>
.stepper-title {
  font-size: 1.3rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}
.room-slider-sheet {
  background-color: transparent !important;
  max-width: 100%;
}
.slide-item-card {
  cursor: pointer;
  transition: all 0.25s ease-in-out;
  border: 1px solid transparent;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}
.slide-item-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}
.slide-item-card .v-card-subtitle.slide-item-name {
  font-size: 0.85rem !important;
  font-weight: 500;
  line-height: 1.3;
}
.slide-item-image {
  border-bottom: 1px solid #eee;
}
.vergaderruimteCard {
  text-align: center;
  width: 100%;
}
.vergaderruimteCard .detail-image {
  border: 1px solid #eee;
}
.date-picker-custom {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 0;
}
.date-picker-custom .v-date-picker-month__day--disabled > .v-btn {
  background-color: #f5f5f5 !important;
  color: #bdbdbd !important;
  text-decoration: line-through;
  cursor: not-allowed;
  opacity: 0.7;
}
.time-list-placeholder {
  border: 1px dashed #ccc;
  border-radius: 8px;
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fafafa;
}
.time-list {
  max-height: 320px;
  overflow-y: auto;
  width: 100%;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: #fff;
  padding: 8px !important;
}
.time-list .v-list-item {
  border: 1px solid #f0f0f0;
  transition: background-color 0.2s ease, opacity 0.2s ease;
  cursor: pointer;
}
.time-list .v-list-item:not(.time-slot-booked):hover {
  background-color: #f0f0f0;
}
.time-list .time-list-item.time-slot-selected:not(.time-slot-booked) {
  background-color: #e3f2fd !important;
  border-color: #90caf9 !important;
}
.time-list-item.time-slot-booked {
  background-color: #eeeeee !important;
  opacity: 0.7;
  cursor: not-allowed;
}
.time-list-item.time-slot-booked .v-list-item-title {
  text-decoration: line-through;
  color: #757575;
}
.time-list-item .v-list-item-action .v-checkbox-btn {
  pointer-events: none;
}
.popular-chip {
  font-size: 0.65rem !important;
  height: 16px !important;
  line-height: 1;
  padding: 0 6px !important;
}
.v-container {
  max-width: 1200px !important;
}
.v-stepper-window .v-stepper-window-item {
  padding: 24px 16px;
}
.v-stepper-actions {
  padding: 16px 24px;
}
.v-stepper-header {
  margin-bottom: 16px;
}
</style>
