<template>
<div class="detail-data">
  <div v-for="field in Object.keys(props.data.fields)" class="detail-data-item" :class="{'hidden': field === '_label'}">
    <template v-if="field === 'user'">
      <strong>{{ field }}:</strong> {{ props.data.data[field].value }}
    </template>
    <template v-else>
      <strong>{{ field }}:</strong> {{ props.data.data[field] }}
    </template>
  </div>
</div>
</template>
<script setup lang="ts">
import { PropType } from 'vue';

const props = defineProps({
  data: {
    type: Object as PropType<any>,
    required: true,
  },
})
</script>

<style scoped>
.detail-data {
  width: 500px;
  padding: 30px;
  margin: 0 auto
}
.detail-data-item {
  margin-bottom: 20px;
}
.hidden {
  display: none;
}
</style>