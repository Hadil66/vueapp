<template>
  <v-container>
    <!-- Loading and Error States -->
    <v-row v-if="isLoading && !apiError" justify="center" class="my-10">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="ml-4 align-self-center">Gegevens laden...</p>
    </v-row>
    <v-alert v-if="apiError && currentStep !== 4" type="error" prominent class="my-5">
      {{ apiError }}
    </v-alert>

    <v-row v-if="!isLoading" justify="center">
      <v-col cols="12" lg="10" md="11">
        <v-stepper v-model="currentStep" alt-labels :items="stepperItems" :disabled="isLoading || isSubmittingBooking"
          hide-actions>
          <v-stepper-window>
            <template #item.1>
              <div>
                <h1 style="color:red; border: 2px solid blue;">HTML TEST INSIDE SLOT</h1>
              </div>
              <Step1ReservationSelection :ruimtes="ruimtes" :all-bookings-from-api="allBookingsFromApi"
                :is-loading-parent="isLoading" :is-loading-times="isLoadingTimes" :today-date-string="todayDateString"
                :static-possible-time-slots="staticPossibleTimeSlots"
                v-model:selected-room-id="selectedVergaderruimteId" v-model:selected-date-prop="selectedDate"
                v-model:time-selection-prop="timeSelection" />
            </template>

            <template #item.2>
              <Step2Verification :selected-room-object="selectedRoomObject"
                :formatted-selected-date-long="formattedSelectedDateLong" :time-selection="timeSelection"
                :can-proceed="canProceedToStep2" />
            </template>

            <template #item.3>
              <Step3Submission v-model:reservation-comment-prop="reservationComment"
                :is-submitting-booking="isSubmittingBooking" @submit-booking-requested="submitBooking" />
            </template>

            <template #item.4>
              <Step4Confirmation :last-booking-details="lastBookingDetails" @new-reservation-requested="resetStepper" />
            </template>
          </v-stepper-window>

          <v-stepper-actions>
            <template #prev>
              <v-btn :disabled="currentStep === 1 || isSubmittingBooking" @click="currentStep--">
                Vorige
              </v-btn>
            </template>
            <template #next>
              <v-btn v-if="currentStep < 3" color="primary" :disabled="
                  isSubmittingBooking ||
                  (currentStep === 1 && !canProceedToStep2) ||
                  (currentStep === 2 && !canProceedToStep2)
                " @click="currentStep++">
                Volgende
              </v-btn>
            </template>
          </v-stepper-actions>
        </v-stepper>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed, ref, watch, onMounted } from "vue";
import axios from "axios";
import { WORDPRESS_API_URL, WP_APP_PASSWORD } from "../config";

import Step1ReservationSelection from "./Step1ReservationSelection.vue";
import Step2Verification from "./Step2Verification.vue";
import Step3Submission from "./Step3Submission.vue";
import Step4Confirmation from "./Step4Confirmation.vue";

const currentStep = ref(1);
const ruimtes = ref([]);
const allBookingsFromApi = ref([]);

const selectedVergaderruimteId = ref(null);
const selectedDate = ref(null);
const timeSelection = ref([]);
const reservationComment = ref("");
const lastBookingDetails = ref(null);

const isLoading = ref(true);
const isLoadingTimes = ref(false);
const isSubmittingBooking = ref(false);
const apiError = ref(null);

const stepperItems = ref([
  { title: "Selecteer", value: 1 },
  { title: "Controleer", value: 2 },
  { title: "Reserveer", value: 3 },
]);

const staticPossibleTimeSlots = [
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
];

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

const fetchRooms = async () => {
  try {
    const response = await axios.get(
      `${WORDPRESS_API_URL}/wp/v2/vergaderruimtes?_embed&per_page=100`
    );
    ruimtes.value = response.data.map((room) => ({
      id: room.id,
      name:
        room.acf?.room_short_name || room.title.rendered.replace("Vergaderruimte ", ""),
      fullName: room.acf?.room_full_name || room.title.rendered,
      description: room.content?.rendered || "Geen beschrijving beschikbaar.",
      capacity: room.acf?.room_capacity || 0,
      features: room.acf?.room_features || [],
      imageSrc: room._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null,
    }));
  } catch (error) {
    console.error("Error fetching rooms:", error.response || error);
    apiError.value = `Kon vergaderruimtes niet laden: ${error.message}.`;
    ruimtes.value = [];
  }
};

const fetchAllBookings = async () => {
  try {
    isLoadingTimes.value = true;
    const response = await axios.get(
      `${WORDPRESS_API_URL}/wp/v2/reserveringen?per_page=100`
    );
    allBookingsFromApi.value = response.data.map((booking) => ({
      roomId: booking.acf?.booking_room_id,
      date: booking.acf?.booking_date,
      times: booking.acf?.booking_time_slots || [],
    }));
  } catch (error) {
    console.error("Error fetching bookings:", error.response || error);
    apiError.value = `Kon bestaande reserveringen niet laden: ${error.message}.`;
    allBookingsFromApi.value = [];
  } finally {
    isLoadingTimes.value = false;
  }
};

onMounted(async () => {
  isLoading.value = true;
  apiError.value = null;
  await fetchRooms();
  await fetchAllBookings();
  isLoading.value = false;
});

watch(selectedVergaderruimteId, (newId, oldId) => {
  if (newId !== oldId) {
    reservationComment.value = "";
  }
});

const selectedRoomObject = computed(() => {
  if (selectedVergaderruimteId.value === null || !ruimtes.value.length) return null;
  return ruimtes.value.find((ruimte) => ruimte.id === selectedVergaderruimteId.value);
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

const canProceedToStep2 = computed(() => {
  return (
    selectedVergaderruimteId.value !== null &&
    selectedDate.value !== null &&
    timeSelection.value.length > 0
  );
});

const submitBooking = async () => {
  if (!canProceedToStep2.value) {
    alert("Selecteer aub een ruimte, datum en tijdslot(en) in Stap 1.");
    currentStep.value = 1;
    return;
  }
  isSubmittingBooking.value = true;
  apiError.value = null;

  const bookingPayload = {
    status: "publish",
    title: `Reservering voor ${selectedRoomObject.value.name} op ${formatDateISO(
      selectedDate.value
    )}`,
    acf: {
      booking_room_id: selectedRoomObject.value.id,
      booking_date: formatDateISO(selectedDate.value),
      booking_time_slots: [...timeSelection.value],
      booking_comment: reservationComment.value || "",
    },
  };

  const usernameFromEnv = import.meta.env.VITE_WP_USERNAME;
  const appPasswordFromConfig = WP_APP_PASSWORD;

  if (!usernameFromEnv || !appPasswordFromConfig) {
    apiError.value = "Authenticatiegegevens ontbreken.";
    isSubmittingBooking.value = false;
    return;
  }
  const base64Credentials = btoa(`${usernameFromEnv}:${appPasswordFromConfig}`);

  try {
    await axios.post(`${WORDPRESS_API_URL}/wp/v2/reserveringen`, bookingPayload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${base64Credentials}`,
      },
    });
    lastBookingDetails.value = {
      roomId: selectedRoomObject.value.id,
      roomName: selectedRoomObject.value.fullName,
      date: formatDateISO(selectedDate.value),
      formattedDate: formattedSelectedDateLong.value,
      times: [...timeSelection.value],
      comment: reservationComment.value || "",
      isApiBooking: true,
    };
    await fetchAllBookings();
    currentStep.value = 4;
  } catch (error) {
    console.error("Error submitting booking:", error.response?.data || error.message);
    apiError.value = `Fout bij het maken van de reservering: ${
      error.response?.data?.message || error.message
    }.`;
  } finally {
    isSubmittingBooking.value = false;
  }
};

const resetStepper = async () => {
  selectedVergaderruimteId.value = null;
  selectedDate.value = null;
  timeSelection.value = [];
  reservationComment.value = "";
  lastBookingDetails.value = null;
  currentStep.value = 1;
  apiError.value = null;
};

watch(currentStep, (newStep) => {
  const confirmationStepExists = stepperItems.value.some((item) => item.value === 4);
  if (newStep === 4 && !confirmationStepExists) {
    stepperItems.value.push({ title: "Bevestigd", value: 4 });
  } else if (newStep < 4 && confirmationStepExists) {
    stepperItems.value = stepperItems.value.filter((item) => item.value !== 4);
  }
});
</script>

<style>
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
.v-col-sm-6 {
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
  flex-direction: column;
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
  border-color: var(--v-primary-base, #1976d2) !important;
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
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}
.v-stepper-header {
  margin-bottom: 16px;
}
</style>
