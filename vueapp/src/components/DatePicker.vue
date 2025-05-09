<template>
  <v-date-picker :model-value="props.modelValue" @update:model-value="handleDateUpdate" :first-day-of-week="1"
    show-adjacent-months hide-header :allowed-dates="props.allowedDatesFn" color="primary"
    class="mt-2 mx-auto date-picker" :disabled="props.disabled" :min="props.minDate" width="100%" />
</template>

<script setup>
const props = defineProps({
  modelValue: { type: [Date, String, null], default: null },
  allowedDatesFn: { type: Function, required: true },
  disabled: { type: Boolean, default: false },
  minDate: { type: String, required: true },
});
const emit = defineEmits(["update:modelValue"]);
const handleDateUpdate = (date) => {
  emit("update:modelValue", date);
};
</script>

<style lang="scss" scoped>
  .date-picker {
    border: 1px solid $border-color-light;
    border-radius: $border-radius-default;
    padding: 0;

    .v-date-picker-month__day--disabled {
      > .v-btn { 
        background-color: $disabled-bg-color !important;
        color: $disabled-text-color !important;
        text-decoration: line-through;
        cursor: not-allowed;
        opacity: 0.7;
      }
    }
  }
</style>