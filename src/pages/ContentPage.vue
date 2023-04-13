<template>
  <v-text-field
    v-model="search"
    append-icon="mdi-magnify"
    label="Search"
    single-line
    hide-details
  >
  </v-text-field>
<v-data-table
  :headers="headers"
  :items="data.results"
  :search="search"
>
<template v-slot:item="{ item }">
  <tr>
    <td v-for="i in headers">      
      <div v-if="i.key === 'user'">
        {{ item.columns[i.key].value  }}
      </div>
      <div v-else-if="i.key === 'actions'">
        <v-icon icon="mdi-pencil"></v-icon>
        <v-icon icon="mdi-delete"></v-icon>
      </div>
      <div v-else>{{ item.columns[i.key] }}</div>
    </td>
  </tr>
</template>
</v-data-table>

</template>

<script setup>
import { useRoute } from 'vue-router'
import axios from '../../src/plugins/axios';
import { watch, ref, onBeforeMount } from 'vue'
import { VDataTable } from 'vuetify/labs/VDataTable'

const apiKey = import.meta.env.VITE_API_KEY

const search = ref('')

const route = useRoute()
const param = ref(route.params.page)

onBeforeMount(() => {
  getData(param.value)
}),

watch(
  () => route.params.page,
  (newValue) => {
      param.value = newValue;
      getData(newValue)
  }
);
//////

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
///////

const normFields = (arr) => {
  let res = []
  Object.keys(arr).map($ => {
    if($ !== "_label")
      res.push(
        {
          title: arr[$].attributes.label,
          key: arr[$].source,
          sortable: arr[$].sortable,
        }
      )
  })
  res.push(
    {
      title: "",
      key: "actions",
      sortable: false,
    }
  )
  return res
}

const getDefaultAlign = (field) => {
  if (["number"].includes(field.type)) {
    return "right";
  }
  return "left";
}
const headers = ref([])
const info = ref([])
const data = ref([])
const getData = async (path) => { 
  let pathSepar = splitAndReplace(removeListSuffix(path))
  console.log(pathSepar)
  if(endsWithList(path)) 
    try {
      const options = await axios.options(`${apiKey}${pathSepar[0]}/${pathSepar[1]}`);
      const response = await axios.get(`${apiKey}${pathSepar[0]}/${pathSepar[1]}/?limit=10&offset=0`);
      info.value = options.data
      data.value = response.data
      console.log(info.value.fields)
      headers.value = normFields(info.value.fields)      
    } catch (error) {
      console.error(error);
    }
} 

// https://polyxdev.plgdev.com/apiadmin/admin_rest/match/

</script>