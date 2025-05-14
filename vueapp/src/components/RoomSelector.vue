<template>
  <v-sheet class="mx-auto meeting-room-slider" width="100%">
    <v-slide-group :model-value="props.modelValue" @update:model-value="emitUpdate" center-active show-arrows
      class="py-2">
      <v-slide-group-item v-for="ruimte in props.ruimtes" :key="ruimte.id" :value="ruimte.id"
        v-slot="{ isSelected, toggle }">
        <v-card :color="isSelected ? 'primary' : 'grey-lighten-4'" :variant="isSelected ? 'elevated' : 'outlined'"
          class="ma-3 meeting-room" height="190" width="140" @click="toggle" :elevation="isSelected ? 4 : 0">
          <v-img :src="ruimte.imageSrc || '/images/placeholder.png'" :alt="ruimte.name + ' afbeelding'" height="120"
            cover class="meeting-room-img">
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
</template>

<script setup>
const props = defineProps({
  ruimtes: { type: Array, required: true },
  modelValue: { type: [Number, String], default: null },
});
const emit = defineEmits(["update:modelValue"]);

const emitUpdate = (value) => {
  emit("update:modelValue", value);
};
</script>

<style lang="scss" scoped>
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
    background-color: $background-light;
    box-shadow: 4px 4px 2px -4px rgba(0,0,0,0.22) !important;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
    }

    .v-card-subtitle.meeting-room-name {
      font-size: $font-size-small !important;
      font-weight: 500;
      line-height: 1.3;
    }

    &-img { // .meeting-room-img
      border-bottom: 1px solid $border-color-light;
    }

    &-card { // .meeting-room-card
      text-align: center;
      width: 100%;

      .meeting-room-detail-image {
        border: 1px solid $border-color-light;
      }
    }
  }
</style>