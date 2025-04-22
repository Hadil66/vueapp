<template>
  <div class="text-center">
    <v-menu
      open-on-hover
    >
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
        >
          <img src="@/assets/menu-bars.svg">
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          :value="index"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script setup>
  const items = [
    { title: 'Kantoorruimte' },
    { title: 'Werkplek' },
    { title: 'Vergaderruimte' },
    { title: 'Locaties' },
    { title: 'Over Tauro' },
    { title: 'Contact' }
  ]
</script>

<style>
  .text-center {
    text-align: end !important;
  }
  .v-btn {
    padding: 5px;
    height: auto !important;
  }

</style>
