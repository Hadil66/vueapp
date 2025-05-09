<template>
  <div class="nav">
    <img src="@/assets/tauro-logo.svg" class="tauro-logo" alt="Tauro logo">

    <v-menu open-on-hover>
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" aria-label="Menu bars" title="Menu">
          <svg width="40px" height="40px" viewBox="0 0 512 512" version="1.1" xml:space="preserve"
            xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <g id="_x37_20-_menu__x2C__ui__x2C__user_interface__x2C_">
              <g>
                <line
                  style="fill:none;stroke:#000000;stroke-width:13.4167;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:2.6131;"
                  x1="26.7" x2="486.25" y1="105.643" y2="105.643" />
                <line
                  style="fill:none;stroke:#000000;stroke-width:13.4167;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:2.6131;"
                  x1="26.7" x2="486.25" y1="256.511" y2="256.511" />
                <line
                  style="fill:none;stroke:#000000;stroke-width:13.4167;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:2.6131;"
                  x1="26.7" x2="486.25" y1="407.312" y2="407.312" />
              </g>
            </g>
            <g id="Layer_1" />
          </svg>
        </v-btn>
      </template>

      <v-list>
        <v-list-item v-for="(item, index) in items" :key="index" :value="index">
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <div class="big-menu">
      <v-list>
        <v-list-item v-for="(item, index) in items" :key="index" tabindex="0">
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </div>
  </div>
  <img src="@/assets/tauro_header.webp" class="header-image" alt="Mensen in een kantoorruimte" loading="eager"
    fetchpriority="high">
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
.nav {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 2em;
  height: 7em;
}

.tauro-logo {
  z-index: 24;
  height: 15em;
  margin-top: -1em;
}

@media (max-width:650px) {
  .tauro-logo {
    height: 10em;
  }
}

@media (max-width:1079px) {
  .nav .v-btn {
    padding: 5px;
    height: 4em !important;
    border-radius: 50%;
    background-color: rgba(249, 248, 246, 0.75) !important;
    z-index: 82;
  }

  .big-menu {
    display: none;
  }
}

@media (min-width:1080px) {
  .nav .v-btn {
    display: none;
  }
}

.big-menu {
  height: max-content;
}

.big-menu .v-list {
  background-color: rgba(249, 248, 246, 0.75) !important;
  display: flex !important;
  flex-direction: row !important;
  gap: 15px;
  height: 3em !important;
  padding: 0 10px !important;
  border-radius: 50px;
}

.big-menu .v-list .v-list-item {
  width: max-content;
  padding: 0;
  height: 20px !important;
}

.big-menu .v-list .v-list-item .v-list-item__content .v-list-item-title {
  font-size: 16px !important;
  border: none;
}

.big-menu .v-list .v-list-item .v-list-item--density-default .v-list-item--one-line {
  min-height: 0 !important;
}

.header-image {
  max-height: 35em;
  width: 97vw;
  border-radius: 8px;
  margin: -6em auto 1em auto;
  align-items: center;
  display: flex;
}

@media(min-width:1536px) {
  .header-image {
    width: 70vw;
  }

  .nav {
    width: 70vw;
    margin: 0 auto;
  }
}
</style>
