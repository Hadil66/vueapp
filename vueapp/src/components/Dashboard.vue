<template>
  <v-card class="mx-auto" max-width="200">
    <v-list>
      <h1>Locaties in de randstad</h1>
      <v-list-item v-for="(locatie, index) in locaties" :key="index">
        <v-list-item-content>
          <v-list-item-title>{{ locatie }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      locaties: [
        'Alphen a/d Rijn',
        'Amsterdam',
        'Delft',
        'Den Haag',
        'Heemstede',
        'Oegstgeest',
        'Rijswijk'
      ],
    };
  },
};
</script>

<style>
  .v-card.mx-auto {
    max-width: none !important;
    border-radius: 0 !important;
  }

  @media (min-width: 600px) { 
    .v-list {
      background: none !important;
      display: flex !important;
    }
  }

  h1 {
    font-size: clamp(1.5625rem, 1.027rem + 2.2549vw, 3rem) !important;
    padding: 0 16px;
  }

  .v-list-item:hover, .v-list-item:focus {
      color: pink !important;
      text-decoration: underline;
      cursor: pointer;
  }
</style>
