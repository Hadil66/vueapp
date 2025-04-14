<template>
  <v-container class="fill-height" max-width="900">
    <v-app-bar :elevation="2">
      <template v-slot:prepend>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
      </template>

      <v-app-bar-title>Application Bar</v-app-bar-title>
    </v-app-bar>
    <v-row>
    <v-col cols="12" md="4">
      <v-card
        subtitle="This is a card subtitle"
        text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, ratione debitis quis est labore voluptatibus!"
        title="This is a title"
      ></v-card>

      <div class="text-center text-caption">Using Props Only</div>
    </v-col>

    <v-col cols="12" md="4">
      <v-card>
        <template v-slot:title>
          This is a title
        </template>

        <template v-slot:subtitle>
          This is a card subtitle
        </template>

        <template v-slot:text>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, ratione debitis quis est labore voluptatibus!
        </template>
      </v-card>

      <div class="text-center text-caption">Using Slots Only</div>
    </v-col>

    <v-col cols="12" md="4">
      <v-card>
        <v-card-item>
          <v-card-title>This is a title</v-card-title>

          <v-card-subtitle>This is a card subtitle</v-card-subtitle>
        </v-card-item>

        <v-card-text>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, ratione debitis quis est labore voluptatibus!
        </v-card-text>
      </v-card>

      <div class="text-center text-caption">Using Markup Only</div>
    </v-col>
  </v-row>
  </v-container>
</template>

<script setup>
  const links = [
    {
      href: 'https://vuetifyjs.com/',
      icon: 'mdi-text-box-outline',
      subtitle: 'Learn about all things Vuetify in our documentation.',
      title: 'Documentation',
    },
    {
      href: 'https://vuetifyjs.com/introduction/why-vuetify/#feature-guides',
      icon: 'mdi-star-circle-outline',
      subtitle: 'Explore available framework Features.',
      title: 'Features',
    },
    {
      href: 'https://vuetifyjs.com/components/all',
      icon: 'mdi-widgets-outline',
      subtitle: 'Discover components in the API Explorer.',
      title: 'Components',
    },
    {
      href: 'https://discord.vuetifyjs.com',
      icon: 'mdi-account-group-outline',
      subtitle: 'Connect with Vuetify developers.',
      title: 'Community',
    },
  ]
</script>
