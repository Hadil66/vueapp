<template>
  <div>
    <h3 class="stepper-title">Stap 1: Kies Ruimte, Datum & Tijd</h3>
    <v-row>
      <v-col
        cols="12"
        v-if="
          !props.isLoadingParent && props.ruimtes.length === 0 && !props.isLoadingTimes
        "
      >
        <v-alert type="info" variant="tonal">Geen vergaderruimtes beschikbaar.</v-alert>
      </v-col>
      <v-col cols="12" v-else-if="!props.isLoadingParent || props.ruimtes.length > 0">
        <h4>Kies een vergaderruimte</h4>
        <!-- ROOM SELECTOR COMPONENT -->
        <RoomSelector :ruimtes="props.ruimtes" v-model="localSelectedRoomId" />
      </v-col>

      <v-col cols="12" v-if="localSelectedRoomId">
        <v-divider class="my-4"></v-divider>
        <v-row>
          <v-col cols="12" md="4">
            <h4>Gekozen Ruimte Details</h4>
            <!-- ROOM DETAILS CARD COMPONENT -->
            <RoomDetailsCard
              v-if="selectedRoomObject"
              :selected-room-object="selectedRoomObject"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-row>
              <v-col cols="12">
                <h4>Selecteer Datum</h4>
                <!-- DATE PICKER COMPONENT -->
                <DatePicker
                  v-model="localSelectedDate"
                  :allowed-dates-fn="allowedDates"
                  :disabled="!selectedRoomObject"
                  :min-date="props.todayDateString"
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="4">
            <h4>Selecteer Tijd(en)</h4>
            <!-- TIME SLOT PICKER COMPONENT -->
            <TimeSlotPicker
              :selected-date="localSelectedDate"
              :formatted-selected-date-short="formattedSelectedDateShort"
              :static-possible-time-slots="props.staticPossibleTimeSlots"
              :booked-slots="bookedSlotsForSelectedDate"
              v-model="localTimeSelection"
              :is-loading-times="props.isLoadingTimes"
              :all-times-booked-for-date="allTimesBookedForDate"
              :popular-time-slots-set="popularTimeSlots"
              :is-time-slot-booked-fn="isTimeSlotBooked"
              :is-popular-fn="isPopular"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import RoomSelector from "./RoomSelector.vue";
import RoomDetailsCard from "./RoomDetailsCard.vue";
import DatePicker from "./DatePicker.vue";
import TimeSlotPicker from "./TimeSlotPicker.vue";

const props = defineProps({
  ruimtes: { type: Array, default: () => [] },
  allBookingsFromApi: { type: Array, default: () => [] },
  isLoadingParent: { type: Boolean, default: false },
  isLoadingTimes: { type: Boolean, default: false },
  todayDateString: { type: String, required: true },
  staticPossibleTimeSlots: { type: Array, required: true },
  selectedRoomId: { type: [Number, String], default: null },
  selectedDateProp: { type: [Date, String, null], default: null },
  timeSelectionProp: { type: Array, default: () => [] },
});

const emit = defineEmits([
  "update:selectedRoomId",
  "update:selectedDateProp",
  "update:timeSelectionProp",
]);

const localSelectedRoomId = computed({
  get: () => props.selectedRoomId,
  set: (value) => emit("update:selectedRoomId", value),
});

const localSelectedDate = computed({
  get: () =>
    props.selectedDateProp
      ? props.selectedDateProp instanceof Date
        ? props.selectedDateProp
        : new Date(props.selectedDateProp)
      : null,
  set: (value) => emit("update:selectedDateProp", value),
});

const localTimeSelection = computed({
  get: () => props.timeSelectionProp,
  set: (value) => emit("update:timeSelectionProp", value),
});

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

const selectedRoomObject = computed(() => {
  if (localSelectedRoomId.value === null || !props.ruimtes.length) return null;
  return props.ruimtes.find((ruimte) => ruimte.id === localSelectedRoomId.value);
});

const bookingsForSelectedRoom = computed(() => {
  if (!selectedRoomObject.value || !props.allBookingsFromApi.length) return [];
  return props.allBookingsFromApi.filter(
    (b) => String(b.roomId) === String(selectedRoomObject.value.id)
  );
});

const bookedSlotsForSelectedDate = computed(() => {
  const dateStr = formatDateISO(localSelectedDate.value);
  if (!selectedRoomObject.value || !dateStr || !bookingsForSelectedRoom.value.length)
    return [];
  const bookingForDate = bookingsForSelectedRoom.value.find((b) => b.date === dateStr);
  return bookingForDate ? bookingForDate.times : [];
});

const allTimesBookedForDate = computed(() => {
  if (
    !selectedRoomObject.value ||
    !localSelectedDate.value ||
    props.staticPossibleTimeSlots.length === 0
  )
    return false;
  return bookedSlotsForSelectedDate.value.length >= props.staticPossibleTimeSlots.length;
});

const fullyBookedDatesForSelectedRoom = computed(() => {
  const bookedDates = new Set();
  if (!selectedRoomObject.value || !bookingsForSelectedRoom.value.length)
    return bookedDates;
  const bookingsByDate = {};
  bookingsForSelectedRoom.value.forEach((booking) => {
    if (!bookingsByDate[booking.date]) bookingsByDate[booking.date] = new Set();
    (booking.times || []).forEach((time) => bookingsByDate[booking.date].add(time));
  });
  for (const date in bookingsByDate) {
    if (bookingsByDate[date].size >= props.staticPossibleTimeSlots.length) {
      bookedDates.add(date);
    }
  }
  return bookedDates;
});

const popularTimeSlots = computed(() => {
  const counts = {};
  let maxCount = 0;
  props.staticPossibleTimeSlots.forEach((time) => (counts[time] = 0));
  props.allBookingsFromApi.forEach((booking) => {
    (booking.times || []).forEach((time) => {
      if (counts[time] !== undefined) {
        counts[time]++;
        if (counts[time] > maxCount) maxCount = counts[time];
      }
    });
  });
  const popularSet = new Set();
  if (maxCount > 0) {
    const popularityThreshold = Math.max(1, Math.ceil(maxCount * 0.6));
    props.staticPossibleTimeSlots.forEach((time) => {
      if (counts[time] >= popularityThreshold) popularSet.add(time);
    });
  }
  return popularSet;
});

const formattedSelectedDateShort = computed(() => {
  if (!localSelectedDate.value) return "";
  const date = localSelectedDate.value;
  if (isNaN(date.getTime())) return "Ongeldige datum";
  return date.toLocaleDateString("nl-NL", { month: "long", day: "numeric" });
});

const isTimeSlotBooked = (time) => bookedSlotsForSelectedDate.value.includes(time);
const isPopular = (time) => popularTimeSlots.value.has(time);

const allowedDates = (dateValue) => {
  const date = new Date(dateValue);
  date.setHours(0, 0, 0, 0);
  const today = new Date(props.todayDateString);
  today.setHours(0, 0, 0, 0);

  if (date < today) return false;
  const day = date.getDay();
  const dateStr = formatDateISO(date);
  const isWeekend = day === 0 || day === 6;
  if (isWeekend) return false;
  if (fullyBookedDatesForSelectedRoom.value.has(dateStr)) return false;
  return true;
};

watch(
  () => props.selectedRoomId,
  (newId, oldId) => {
    if (newId !== oldId) {
      emit("update:selectedDateProp", null);
      emit("update:timeSelectionProp", []);
    }
  }
);

watch(
  () => props.selectedDateProp,
  (newDate, oldDate) => {
    const newDateStr = newDate ? formatDateISO(newDate) : null;
    const oldDateStr = oldDate ? formatDateISO(oldDate) : null;
    if (newDateStr !== oldDateStr) {
      emit("update:timeSelectionProp", []);
    }
  }
);
</script>
