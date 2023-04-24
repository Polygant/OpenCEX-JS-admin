<template>
<div class="detail-data">
  <div v-for="field in Object.keys(props.data.list_fields)" class="detail-data-item" :class="{'hidden': field === '_label'}">
    <template v-if="props.data.list_fields[field].attributes.read_only === true">
    <br/>
    </template>
    <template v-else-if="props.data.list_fields[field].type === 'boolean'">
      <v-checkbox
        :label="props.data.list_fields[field].attributes.label"
        v-model="values[field]"
      ></v-checkbox>
    </template>
    <template v-else-if="props.data.list_fields[field].type === 'datetime'">
      <VueDatePicker 
        v-model="values[field]" 
        text-input 
        />
    </template>
    <template v-else>
      <v-text-field 
        :label="props.data.list_fields[field].attributes.label"
        v-model="values[field]"
        :hint="props.data.list_fields[field].attributes.hint"
      ></v-text-field>
    </template>
  </div>
  <v-btn color="primary" block @click="save">Save</v-btn>
</div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router'
import localConfig from "@/local_config"
import axios from '../plugins/axios'

const apiKey = localConfig.api
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})

const values = ref({})
const route = useRoute()
const param = ref(route.params.page)

function splitAndReplace(str) {
  const parts = str.split('_');
  const lastPart = parts.pop();
  const firstPart = parts.join('_');

  return [firstPart, lastPart];
}

const endsWithList = (str) => {
  return str.endsWith('_list');
}
const removeListSuffix = (str) => {
  const suffix = '_list';

  if (str.endsWith(suffix)) {
    return str.slice(0, -suffix.length);
  }
  
  return str;
}
const save = async () => {
  let pathSepar = splitAndReplace(removeListSuffix(param.value))
  if(endsWithList(param.value)) 
    try {
      await axios.patch(`${apiKey}${pathSepar[0]}/${pathSepar[1]}/${props.data.data.id}/`, values.value)
      location.reload()
    } catch (error) {
      console.error(error.type);
    }
}

onMounted(() => {
  Object.keys(props.data.list_fields).forEach((field) => {
    values.value[field] = props.data.data[field];
  });
});
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