<template>
  <v-sheet class="mx-auto meeting-room-slider" width="100%">
    <v-slide-group
      :model-value="props.modelValue"
      @update:model-value="emitUpdate"
      center-active
      show-arrows
      class="py-2"
    >
      <v-slide-group-item
        v-for="ruimte in props.ruimtes"
        :key="ruimte.id"
        :value="ruimte.id"
        v-slot="{ isSelected, toggle }"
      >
        <v-card
          :color="isSelected ? 'primary' : 'grey-lighten-4'"
          :variant="isSelected ? 'elevated' : 'outlined'"
          class="ma-3 meeting-room"
          height="190"
          width="140"
          @click="toggle"
          :elevation="isSelected ? 4 : 0"
        >
          <v-img
            :src="ruimte.imageSrc || '/images/placeholder.png'"
            :alt="ruimte.name + ' afbeelding'"
            height="120"
            cover
            class="meeting-room-img"
          >
            <template #placeholder>
              <v-img
                src="/images/placeholder.png"
                height="120"
                cover
                alt="Laden..."
              ></v-img>
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
