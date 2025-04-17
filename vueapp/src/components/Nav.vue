<template>
  <v-app>
    <v-container>
      <v-app-bar :elevation="2">
        <template v-slot:prepend>
          <v-app-bar-nav-icon></v-app-bar-nav-icon>
        </template>
      
        <v-app-bar-title>Tauro</v-app-bar-title>
      </v-app-bar>
    </v-container>
  </v-app>
</template>

<style>
  .v-toolbar__content {
    display: flex !important;
    flex-direction: row-reverse !important;
  }

  .v-application__wrap {
    min-height: 6em !important;
  }

</style>
