<template>
  <div class="detail-data">
    <div v-for="field in Object.keys(props.data.fields)" class="detail-data-item" :class="{'hidden': field === '_label'}">
      <template v-if="props.data.fields[field].attributes.read_only === true"></template>
      <template v-else-if="props.data.fields[field].type === 'boolean'">
        <v-checkbox
          :label="props.data.fields[field].attributes.label"
          v-model="values[field]"
        ></v-checkbox>
      </template>
      <template v-else-if="props.data.fields[field].type === 'choice'">
        <label>{{ props.data.fields[field].attributes.label }}</label>
        <v-select
          item-title="text"
          item-value="value"
          :items="props.data.fields[field].attributes.choices"
          :label="props.data.fields[field].attributes.label"
          v-model="values[field]"
        ></v-select>
      </template>
      <template v-else-if="props.data.fields[field].type === 'datetime'">
        <v-date-picker v-model="values[field]"></v-date-picker>
      </template>
      <template v-else>
        <v-text-field 
          :label="props.data.fields[field].attributes.label"
          v-model="values[field]"
          :hint="props.data.fields[field].attributes.hint"
        ></v-text-field>
      </template>
    </div>
    <v-btn color="primary" variant="tonal" block @click="save">Save</v-btn>
  </div>
  </template>
  <script setup>
  import { onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router'
  import localConfig from "@/local_config"
  import axios from '../plugins/axios'
  import { splitAndReplace, endsWithList, removeListSuffix } from "../plugins/helpers"
  
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
  
  const save = async () => {
    let pathSepar = splitAndReplace(removeListSuffix(param.value))
    if(endsWithList(param.value)) 
      try {
        await axios.post(`${apiKey}${pathSepar[0]}/${pathSepar[1]}/`, values.value)
        location.reload()
      } catch (error) {
        console.error(error.type);
      }
  }

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