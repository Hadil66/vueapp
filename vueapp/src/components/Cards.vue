<template>
  <v-container>
    <!-- Loading and Error States -->
    <v-row v-if="isLoading" justify="center" class="my-10">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="ml-4 align-self-center">Gegevens laden...</p>
    </v-row>
    <v-alert v-if="apiError" type="error" prominent class="my-5">
      {{ apiError }}
    </v-alert>

    <v-row v-if="!isLoading && !apiError" justify="center">
      <v-col cols="12" lg="10" md="11">
        <v-stepper
          v-model="currentStep"
          alt-labels
          prev-text="Vorige"
          next-text="Volgende"
          :items="stepperItems"
          :disabled="isLoading"
        >
          <v-stepper-window>
            <!-- Step 1: Select Room, Date, Time -->
            <v-stepper-window-item :value="1">
              <h3 class="stepper-title">Stap 1: Kies Ruimte, Datum & Tijd</h3>
              <v-row>
                <v-col cols="12" v-if="ruimtes.length === 0 && !isLoading">
                  <v-alert type="info" variant="tonal">Geen vergaderruimtes beschikbaar.</v-alert>
                </v-col>
                <v-col cols="12" v-else>
                  <h4>Kies een vergaderruimte</h4>
                  <v-sheet class="mx-auto meeting-room-slider" width="100%">
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
                          class="ma-3 meeting-room"
                          height="190"
                          width="140"
                          @click="toggle"
                          :elevation="isSelected ? 4 : 0"
                        >
                          <v-img
                            :src="ruimte.imageSrc || '/images/placeholder.png'"
                            :alt="ruimte.name + ' afbeelding'"
                            height="120"
                            cover
                            class="meeting-room-img"
                          >
                            <template #placeholder>
                              <v-img src="/images/placeholder.png" height="120" cover alt="Laden..."></v-img>
                            </template>
                            <template #error>
                              <v-img src="/images/placeholder.png" height="120" cover alt="Fout"></v-img>
                            </template>
                          </v-img>
                          <v-card-subtitle class="pt-3 pb-1 text-center meeting-room-name">
                            {{ ruimte.name }}
                          </v-card-subtitle>
                          <v-card-text class="text-caption text-center pa-0">
                            Max: {{ ruimte.capacity }} pers.
                          </v-card-text>
                        </v-card>
                      </v-slide-group-item>
                    </v-slide-group>
                  </v-sheet>
                </v-col>

                <v-col cols="12" v-if="selectedVergaderruimteId">
                  <v-divider class="my-4"></v-divider>
                  <v-row>
                    <v-col cols="12" md="4">
                      <h4>Gekozen Ruimte Details</h4>
                      <v-card
                        class="pa-3 mt-2 meeting-room-card"
                        v-if="selectedRoomObject"
                        flat
                        border
                      >
                        <v-img
                          :src="selectedRoomObject.imageSrc || '/images/placeholder.png'"
                          :alt="selectedRoomObject.fullName + ' afbeelding'"
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
                          {{ selectedRoomObject.fullName }}
                        </v-card-title>
                        <v-card-text class="text-body-2 text-center pb-1" v-html="selectedRoomObject.description"></v-card-text>
                        <v-card-text class="text-body-2 text-center pt-0">
                          Capaciteit: <strong>{{ selectedRoomObject.capacity }} personen</strong>
                        </v-card-text>
                        <v-card-text class="text-body-2 text-center pt-0">
                          Features: <strong>{{ selectedRoomObject.features.join(', ') }}</strong>
                        </v-card-text>
                      </v-card>
                    </v-col>
                    <v-col cols="12" md="4">
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
                            class="mt-2 mx-auto date-picker"
                            :disabled="!selectedRoomObject"
                            :min="todayDateString"
                            width="100%"
                          />
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12" sm="4">
                          <h4>Selecteer Tijd(en)</h4>
                          <div
                            v-if="!selectedDate"
                            class="pa-4 mt-2 text-grey-darken-1 text-center time-list-placeholder"
                          >
                            Selecteer eerst een datum.
                          </div>
                           <div v-else-if="isLoadingTimes" class="pa-4 mt-2 text-grey-darken-1 text-center time-list-placeholder">
                            <v-progress-circular indeterminate color="primary" size="32"></v-progress-circular>
                            <p class="ml-2 align-self-center text-caption">Tijden laden...</p>
                          </div>
                          <v-list
                            v-else
                            density="compact"
                            class="mt-2 time-list"
                            lines="one"
                          >
                            <v-list-subheader>
                              Beschikbare tijden op {{ formattedSelectedDateShort }}
                            </v-list-subheader>
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
                              <template #prepend>
                                <v-list-item-action start class="mr-2">
                                  <v-checkbox-btn
                                    :model-value="timeSelection.includes(time)"
                                    :disabled="isTimeSlotBooked(time)"
                                    readonly
                                  ></v-checkbox-btn>
                                </v-list-item-action>
                              </template>
                              <v-list-item-title :class="{ 'booked-text': isTimeSlotBooked(time) }">
                                {{ time }}
                                <v-chip
                                  v-if="isPopular(time)"
                                  size="x-small"
                                  color="orange"
                                  variant="flat"
                                  class="ml-2 popular-chip"
                                >Populair</v-chip>
                              </v-list-item-title>
                            </v-list-item>
                            <p v-if="staticPossibleTimeSlots.length > 0 && allTimesBookedForDate" class="text-caption text-orange text-center pa-4">
                              Alle tijden zijn volgeboekt op deze datum.
                            </p>
                             <p v-if="staticPossibleTimeSlots.length === 0 && !isLoadingTimes" class="text-caption text-grey text-center pa-4">
                              Geen tijdsloten geconfigureerd.
                            </p>
                          </v-list>
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
                    :disabled="isSubmittingBooking"
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
                    :loading="isSubmittingBooking"
                    :disabled="isSubmittingBooking"
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
                    :text="lastBookingDetails?.isApiBooking ? 'Uw reservering is succesvol verwerkt en opgeslagen.' : 'Uw reservering is succesvol (gesimuleerd) verwerkt.'"
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
                  <v-btn color="primary" @click="resetStepper" block>
                    Nieuwe Reservering Maken
                  </v-btn>
                </v-col>
              </v-row>
            </v-stepper-window-item>
          </v-stepper-window>
        </v-stepper>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue';
import axios from 'axios';
import { WORDPRESS_API_URL, WP_APP_PASSWORD } from '../config';

// --- Reactive State ---
const currentStep = ref(1);
const selectedVergaderruimteId = ref(null);
const selectedDate = ref(null);
const timeSelection = ref([]);
const reservationComment = ref('');
const lastBookingDetails = ref(null);

const ruimtes = ref([]);
const allBookingsFromApi = ref([]);

const isLoading = ref(true);
const isLoadingTimes = ref(false);
const isSubmittingBooking = ref(false);
const apiError = ref(null);

const stepperItems = ref([
  { title: 'Selecteer', value: 1 },
  { title: 'Controleer', value: 2 },
  { title: 'Reserveer', value: 3 },
]);

// --- Utility Functions ---
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
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const todayDateString = computed(() => formatDateISO(new Date()));

const staticPossibleTimeSlots = [
  '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00',
  '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00',
];

const fetchRooms = async () => {
  try {
    const response = await axios.get(`${WORDPRESS_API_URL}/wp/v2/vergaderruimtes?_embed&per_page=100`);
    ruimtes.value = response.data.map(room => ({
      id: room.id,
      name: room.acf?.room_short_name || room.title.rendered.replace('Vergaderruimte ', ''),
      fullName: room.acf?.room_full_name || room.title.rendered,
      description: room.content?.rendered || 'Geen beschrijving beschikbaar.',
      capacity: room.acf?.room_capacity || 0,
      features: room.acf?.room_features || [],
      imageSrc: room._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
      bookings: [],
    }));
  } catch (error) {
    console.error('Error fetching rooms:', error.response || error);
    apiError.value = `Kon vergaderruimtes niet laden: ${error.message}. Controleer de API URL en WordPress setup.`;
    ruimtes.value = [];
  }
};

const fetchAllBookings = async () => {
 try {
    isLoadingTimes.value = true;
    const response = await axios.get(`${WORDPRESS_API_URL}/wp/v2/reserveringen?per_page=100`);
    allBookingsFromApi.value = response.data.map(booking => ({
      roomId: booking.acf?.booking_room_id,
      date: booking.acf?.booking_date,
      times: booking.acf?.booking_time_slots || [],
    }));
  } catch (error) {
    console.error('Error fetching bookings:', error.response || error);
    apiError.value = `Kon bestaande reserveringen niet laden: ${error.message}. De beschikbaarheid is mogelijk niet accuraat.`;
    allBookingsFromApi.value = [];
  } finally {
    isLoadingTimes.value = false;
  }
};

const processRoomBookings = () => {
  if (ruimtes.value.length === 0) { // Only check ruimtes, as allBookingsFromApi might be empty if no bookings exist yet
     ruimtes.value.forEach(room => room.bookings = []);
    return;
  }

  ruimtes.value.forEach(room => {
    const relevantApiBookings = allBookingsFromApi.value.filter(b => b.roomId === room.id);
    const roomBookingsByDate = {};

    relevantApiBookings.forEach(apiBooking => {
      if (!roomBookingsByDate[apiBooking.date]) {
        roomBookingsByDate[apiBooking.date] = new Set();
      }
      (apiBooking.times || []).forEach(time => roomBookingsByDate[apiBooking.date].add(time)); // Ensure apiBooking.times is an array
    });

    room.bookings = Object.entries(roomBookingsByDate).map(([date, timesSet]) => ({
      date: date,
      times: Array.from(timesSet).sort(),
    })).sort((a, b) => a.date.localeCompare(b.date));
  });
};

// Lifecycle Hooks
onMounted(async () => {
  isLoading.value = true;
  apiError.value = null;
  await fetchRooms();
  await fetchAllBookings();
  processRoomBookings();
  isLoading.value = false;
});

// Watchers
watch(selectedVergaderruimteId, (newId, oldId) => { // Removed async as it's not needed here
  if (newId !== oldId) {
    selectedDate.value = null;
    timeSelection.value = [];
    reservationComment.value = '';
  }
});

watch(selectedDate, () => {
    timeSelection.value = [];
});

//  Computed Properties
const selectedRoomObject = computed(() => {
  if (selectedVergaderruimteId.value === null) return null;
  return ruimtes.value.find(ruimte => ruimte.id === selectedVergaderruimteId.value);
});

const bookedSlotsForSelectedDate = computed(() => {
  const room = selectedRoomObject.value;
  const dateStr = formatDateISO(selectedDate.value);
  if (!room || !dateStr || !room.bookings) return []; // Add check for room.bookings

  const bookingForDate = room.bookings.find(b => b.date === dateStr);
  return bookingForDate ? bookingForDate.times : [];
});

const allTimesBookedForDate = computed(() => {
  if (!selectedRoomObject.value || !selectedDate.value || staticPossibleTimeSlots.length === 0) return false;
  return bookedSlotsForSelectedDate.value.length >= staticPossibleTimeSlots.length;
});

const fullyBookedDatesForSelectedRoom = computed(() => {
  const bookedDates = new Set();
  const room = selectedRoomObject.value;
  if (!room || !room.bookings) return bookedDates; // Add check for room.bookings

  room.bookings.forEach(booking => {
    if (booking.times && booking.times.length >= staticPossibleTimeSlots.length) { // Check if booking.times exists
      bookedDates.add(booking.date);
    }
  });
  return bookedDates;
});

const popularTimeSlots = computed(() => {
  const counts = {};
  let maxCount = 0;
  staticPossibleTimeSlots.forEach(time => counts[time] = 0);

  allBookingsFromApi.value.forEach(booking => {
    (booking.times || []).forEach(time => { // Ensure booking.times exists
      if (counts[time] !== undefined) {
        counts[time]++;
        if (counts[time] > maxCount) maxCount = counts[time];
      }
    });
  });

  const popularSet = new Set();
  if (maxCount > 0) {
    const popularityThreshold = Math.max(1, Math.ceil(maxCount * 0.6));
    staticPossibleTimeSlots.forEach(time => {
      if (counts[time] >= popularityThreshold) popularSet.add(time);
    });
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
  if (!selectedDate.value) return '';
  const date = selectedDate.value instanceof Date ? selectedDate.value : new Date(selectedDate.value);
  if (isNaN(date.getTime())) return 'Ongeldige datum';
  return date.toLocaleDateString('nl-NL', { month: 'long', day: 'numeric' });
});

const formattedSelectedDateLong = computed(() => {
  if (!selectedDate.value) return '';
  const date = selectedDate.value instanceof Date ? selectedDate.value : new Date(selectedDate.value);
  if (isNaN(date.getTime())) return 'Ongeldige datum';
  return date.toLocaleDateString('nl-NL', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
});

const onDateSelected = (newDateValue) => {
  selectedDate.value = newDateValue;
  timeSelection.value = [];
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

const submitBooking = async () => {
  if (!canProceedToStep2.value) {
    alert('Selecteer aub een ruimte, datum en tijdslot(en) in Stap 1.');
    currentStep.value = 1;
    return;
  }

  isSubmittingBooking.value = true;
  apiError.value = null;

  const bookingPayload = {
    status: 'publish',
    title: `Reservering voor ${selectedRoomObject.value.name} op ${formatDateISO(selectedDate.value)}`,
    acf: {
      booking_room_id: selectedRoomObject.value.id,
      booking_date: formatDateISO(selectedDate.value),
      booking_time_slots: [...timeSelection.value],
      booking_comment: reservationComment.value || '',
    },
  };

  // --- DEBUG AUTH START ---
  console.log("--- DEBUG AUTH ---");
  const usernameFromEnv = import.meta.env.VITE_WP_USERNAME;
  const appPasswordFromConfig = WP_APP_PASSWORD; // This comes from config.js
  console.log("Username from Env (.env.local):", usernameFromEnv);
  console.log("App Password from Config JS (config.js):", appPasswordFromConfig);

  if (!usernameFromEnv || !appPasswordFromConfig) {
      console.error("CRITICAL: Username or App Password is not defined!");
      apiError.value = "Authenticatiegegevens ontbreken. Controleer de .env.local en config.js bestanden.";
      isSubmittingBooking.value = false;
      return; // Stop if critical info is missing
  }

  const credentialsString = `${usernameFromEnv}:${appPasswordFromConfig}`;
  console.log("String to be Base64 encoded:", `'${credentialsString}'`); // Added quotes to see exact string with spaces

  let base64Credentials;
  try {
    base64Credentials = btoa(credentialsString);
  } catch (e) {
    console.error("Error during btoa encoding (possibly invalid characters):", e);
    apiError.value = "Fout bij het coderen van authenticatiegegevens.";
    isSubmittingBooking.value = false;
    return;
  }
  console.log("Base64 Encoded Credentials:", base64Credentials);
  console.log("Full Authorization Header:", `Basic ${base64Credentials}`);
  console.log("--- END DEBUG AUTH ---");
  // --- DEBUG AUTH END ---


  try {
    await axios.post(`${WORDPRESS_API_URL}/wp/v2/reserveringen`, bookingPayload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${base64Credentials}`,
      },
    });

    lastBookingDetails.value = {
      roomId: selectedRoomObject.value.id,
      roomName: selectedRoomObject.value.fullName,
      date: formatDateISO(selectedDate.value),
      formattedDate: formattedSelectedDateLong.value,
      times: [...timeSelection.value],
      comment: reservationComment.value || '',
      isApiBooking: true,
    };

    await fetchAllBookings();
    processRoomBookings();

    currentStep.value = 4;
  } catch (error) {
    console.error('Error submitting booking:', error.response?.data || error.message); // Log full error
    apiError.value = `Fout bij het maken van de reservering: ${error.response?.data?.message || error.message}. Controleer de WordPress authenticatie en CORS instellingen.`;
  } finally {
    isSubmittingBooking.value = false;
  }
};

const resetStepper = async () => {
  selectedVergaderruimteId.value = null;
  selectedDate.value = null;
  timeSelection.value = [];
  reservationComment.value = '';
  lastBookingDetails.value = null;
  currentStep.value = 1;
  apiError.value = null;
};
</script>

<style>
/* Your existing styles remain here */
.stepper-title {
  font-size: 1.3rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}
.meeting-room-slider {
  background-color: transparent !important;
  max-width: 100%;
}
.meeting-room {
  cursor: pointer;
  transition: all 0.25s ease-in-out;
  border: 1px solid transparent;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}
.meeting-room:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}
.meeting-room .v-card-subtitle.meeting-room-name {
  font-size: 0.85rem !important;
  font-weight: 500;
  line-height: 1.3;
}
.meeting-room-img {
  border-bottom: 1px solid #eee;
}
.meeting-room-card {
  text-align: center;
  width: 100%;
}
.meeting-room-card .meeting-room-detail-image {
  border: 1px solid #eee;
}
.v-col-sm-6 { /* This global style might be too broad. Consider more specific selectors if it causes issues elsewhere */
  flex: 0 0 50% !important;
  max-width: 50% !important;
  min-width: 21em !important;
}
.date-picker {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 0;
}
.date-picker .v-date-picker-month__day--disabled > .v-btn {
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