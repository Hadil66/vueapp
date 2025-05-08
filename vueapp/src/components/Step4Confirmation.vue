<template>
    <div>
      <h3 class="stepper-title">Reservering Bevestigd</h3>
      <v-row justify="center">
        <v-col cols="12" md="8" lg="7">
          <div v-if="lastBookingDetails">
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
              <v-btn color="primary" @click="handleNewReservation" block>
              Nieuwe Reservering Maken
              </v-btn>
          </div>
          <v-alert v-else type="info" variant="tonal">
              Geen bevestigingsdetails beschikbaar of er is een fout opgetreden.
          </v-alert>
        </v-col>
      </v-row>
    </div>
  </template>
  
  <script setup>
  defineProps({
    lastBookingDetails: { type: Object, default: null }
  });
  const emit = defineEmits(['new-reservation-requested']);
  
  const handleNewReservation = () => {
    emit('new-reservation-requested');
  };
  </script>