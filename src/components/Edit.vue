<template>
<div class="detail-data">
  {{ values }}
  <div v-for="field in Object.keys(props.data.fields)" class="detail-data-item" :class="{'hidden': field === '_label'}">
    <v-text-field 
      :label="props.data.fields[field].attributes.label"
      :v-model="values[field]"
      ></v-text-field>
  </div>
</div>
</template>
<script setup lang="ts">
import { PropType, ref } from 'vue';

const props = defineProps({
  data: {
    type: Object as PropType<any>,
    required: true,
  },
})

const values = ref({})
Object.keys(props.data.fields).forEach($ => {
  console.log(props.data.data[$])
  values.value[$] = props.data.data[$]
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