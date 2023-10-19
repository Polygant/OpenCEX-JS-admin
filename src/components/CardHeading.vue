<template>
  <div class="v-card--material">
    <v-sheet
      :color="color"
      :max-height="90"
      width="auto"
      elevation="6"
      class="text-start pa-7 rounded"
      dark
    >
      <v-icon size="32" :icon="icon" color="white" />
    </v-sheet>

    <div class="ml-4">
      <div class="font-light text-lg text-black">
        {{ title }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MaterialCard",

  props: {
    title: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "success",
    },
    icon: {
      type: String,
      default: undefined,
    },
  },
};
</script>

<style>
.v-card--material {
  position: relative;
  top: -18px;
  margin-bottom: -18px;
  padding-left: 18px;
  flex-wrap: wrap;
  display: flex;
  align-items: center;
}
</style>
