<template>
  <v-card class="mx-auto" max-width="200">
    <h1>Locaties in de randstad</h1>
    <v-list>
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
    max-width: 960px !important;
    border-radius: 8px !important;
    margin: 2em !important;
    padding: 2em;
  }

  .v-list {
      display: flex !important;
      flex-direction: column !important;
      flex-wrap: wrap !important;
  }

  @media (min-width:600px) {
    .v-list {
      height: 15em !important;
    }
  }

  @media (min-width: 850px) { 
    .v-list {
      height: 10em;
    }
  }

  @media (min-width:960px) {
    .v-card.mx-auto {
      margin: 2em auto !important;
    }
  }

  h1 {
    font-size: clamp(1.5625rem, 1.027rem + 2.2549vw, 3rem) !important;
    padding: 0 16px;
    height: 4em;
    width: clamp(200px, 40%, 400px);
  }

  .v-list-item {
    height: 2em;
  }

  .v-list-item-title {
    font-size: clamp(1.2rem, -2.2593rem + 377.9341vw, 1.5rem) !important;
  }

  .v-list-item:hover, .v-list-item:focus {
      color: pink !important;
      text-decoration: underline;
      cursor: pointer;
  }
</style>
